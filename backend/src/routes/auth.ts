import express from 'express';
import axios from 'axios';
import { PrismaClient } from '../generated/prisma';
import { exchangeCodeForToken, fetchUserRepos } from '../services/github';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateJWT } from '../middlewares/auth';
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

        console.log("reposWithConnection::::::", reposWithConnection);

        res.json({ repos: reposWithConnection });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user repositories' });
    }
});


// Connect a repo (store metadata + webhook secret)

router.post('/connect-repo', async (req, res) => {
    const { userId, githubRepoId, name, owner, webhookSecret } = req.body;
    try {
        // Try to find the repo for this user
        const existingRepo = await prisma.repo.findFirst({
            where: { userId, githubRepoId: String(githubRepoId) },
        });

        let repo;
        if (existingRepo && existingRepo.connected) {
            // If already connected, disconnect it
            repo = await prisma.repo.update({
                where: { id: existingRepo.id },
                data: { connected: false },
            });
        } else if (existingRepo) {
            // If exists but not connected, connect it
            repo = await prisma.repo.update({
                where: { id: existingRepo.id },
                data: { connected: true, name, owner, webhookSecret },
            });
        } else {
            // If not exists, create and connect
            repo = await prisma.repo.create({
                data: { userId, githubRepoId: String(githubRepoId), connected: true, name, owner, webhookSecret },
            });
        }

        res.json({ repo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to toggle repo connection' });
    }
});


export default router;
