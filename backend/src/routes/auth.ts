import express from 'express';
import axios from 'axios';
import { PrismaClient } from '../generated/prisma';
import { exchangeCodeForToken, fetchUserRepos } from '../services/github';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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
router.get('/github/repos', async (req, res) => {
    const token = req.query.token as string;
    if (!token) {
        return res.status(400).json({ error: 'Missing GitHub token' });
    }
    try {
        const repos = await fetchUserRepos(token);
        res.json({ repos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user repositories' });
    }
});

// Connect a repo (store metadata + webhook secret)
router.post('/connect-repo', async (req, res) => {
    const { userId, githubRepoId, name, owner, webhookSecret } = req.body;
    try {
        const repo = await prisma.repo.create({
            data: { userId, githubRepoId, name, owner, webhookSecret },
        });
        res.json({ repo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to connect repo' });
    }
});

export default router;
