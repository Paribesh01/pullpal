import express from 'express';
import axios from 'axios';
import { PrismaClient } from '../generated/prisma';
import { exchangeCodeForToken, fetchUserRepos } from '../services/github';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateJWT } from '../middlewares/auth';
import crypto from 'crypto';
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();



// Step 1: Redirect user to GitHub OAuth
router.get('/github', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope: 'repo user',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// Step 2: GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
    const code = req.query.code as string;
    try {
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code);


        console.log('accessToken', accessToken);
        // Fetch user info
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` },
        });
        const { id, email, login } = userRes.data;

        // Store or update user in DB
        const user = await prisma.user.upsert({
            where: { githubId: String(id) },
            update: { githubToken: accessToken, email: email ?? `${login}@users.noreply.github.com` },
            create: {
                githubId: String(id),
                githubToken: accessToken,
                email: email ?? `${login}@users.noreply.github.com`,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
        res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'GitHub OAuth failed' });
    }
});

// Add this route to fetch user repositories

router.get('/github/repos', authenticateJWT, async (req, res) => {
    // @ts-ignore
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Find the user in the database to get their GitHub token
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.githubToken) {
            return res.status(404).json({ error: 'User or GitHub token not found' });
        }
        const repos = await fetchUserRepos(user.githubToken);

        // Fetch all connected repos for this user from your DB
        const connectedRepos = await prisma.repo.findMany({
            where: { userId, connected: true },
            select: { githubRepoId: true },
        });
        const connectedRepoIds = new Set(connectedRepos.map(r => String(r.githubRepoId)));

        // Add 'connected' property to each repo
        const reposWithConnection = repos.map((repo: any) => ({
            ...repo,
            connected: connectedRepoIds.has(String(repo.id)),
        }));



        res.json({ repos: reposWithConnection });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user repositories' });
    }
});


// Connect a repo (store metadata + webhook secret)

router.post('/connect-repo', async (req, res) => {
    let { userId, githubRepoId, name, owner, webhookSecret } = req.body;
    console.log('[connect-repo] Incoming request:', { userId, githubRepoId, name, owner });
    try {
        // Get user for GitHub token
        const user = await prisma.user.findUnique({ where: { id: userId } });
        console.log('[connect-repo] Fetched user:', user?.id);
        if (!user || !user.githubToken) {
            console.error('[connect-repo] User or GitHub token not found');
            return res.status(404).json({ error: 'User or GitHub token not found' });
        }

        // Generate webhook secret if not provided
        if (!webhookSecret) {
            webhookSecret = crypto.randomBytes(32).toString('hex');
            console.log('[connect-repo] Generated webhookSecret:', webhookSecret);
        }

        // Create webhook on GitHub
        const webhookUrl = process.env.WEBHOOK_URL || 'https://5e7282a1575a.ngrok-free.app/webhooks/github';
        console.log('[connect-repo] Creating webhook on GitHub:', { owner, name, webhookUrl });
        try {
            await axios.post(
                `https://api.github.com/repos/${owner}/${name}/hooks`,
                {
                    name: 'web',
                    active: true,
                    events: ['pull_request'],
                    config: {
                        url: webhookUrl,
                        content_type: 'json',
                        secret: webhookSecret,
                    },
                },
                {
                    headers: {
                        Authorization: `token ${user.githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            console.log('[connect-repo] GitHub webhook created successfully');
        } catch (err) {
            const errorData = (err as any)?.response?.data || err;
            console.error('[connect-repo] Failed to create GitHub webhook:', errorData);
            return res.status(500).json({ error: 'Failed to create GitHub webhook' });
        }

        // Try to find the repo for this user
        const existingRepo = await prisma.repo.findFirst({
            where: { userId, githubRepoId: String(githubRepoId) },
        });
        console.log('[connect-repo] Existing repo:', existingRepo?.id);

        let repo;
        if (existingRepo && existingRepo.connected) {
            // If already connected, disconnect it
            repo = await prisma.repo.update({
                where: { id: existingRepo.id },
                data: { connected: false },
            });
            console.log('[connect-repo] Repo was already connected, now disconnected:', repo.id);
        } else if (existingRepo) {
            // If exists but not connected, connect it
            repo = await prisma.repo.update({
                where: { id: existingRepo.id },
                data: { connected: true, name, owner, webhookSecret },
            });
            console.log('[connect-repo] Repo reconnected:', repo.id);
        } else {
            // If not exists, create and connect
            repo = await prisma.repo.create({
                data: { userId, githubRepoId: String(githubRepoId), connected: true, name, owner, webhookSecret },
            });
            console.log('[connect-repo] Repo created and connected:', repo.id);
        }

        res.json({ repo });
    } catch (err) {
        console.error('[connect-repo] General error:', err);
        res.status(500).json({ error: 'Failed to toggle repo connection' });
    }
});


export default router;
