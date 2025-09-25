import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '../generated/prisma';
import { handlePullRequestEvent } from '../services/review';


const router = express.Router();
const prisma = new PrismaClient();

// Helper to verify GitHub webhook signature
function verifySignature(secret: string, payload: Buffer, signature: string | undefined): boolean {
    if (!signature) return false;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const digest = `sha256=${hmac.digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

router.post('/github', express.raw({ type: '*/*' }), async (req, res) => {
    const event = req.headers['x-github-event'];
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    const payload = req.body;

    // Log incoming headers and event type
    console.log('Received GitHub webhook:', {
        event,
        signature,
        headers: req.headers,
    });

    try {

        let body: any;
        let rawPayload: Buffer;

        if (Buffer.isBuffer(req.body)) {
            rawPayload = req.body;
            body = JSON.parse(rawPayload.toString());
        } else if (typeof req.body === 'string') {
            rawPayload = Buffer.from(req.body);
            body = JSON.parse(req.body);
        } else {
            // Already parsed object (e.g., by express.json())
            body = req.body;
            rawPayload = Buffer.from(JSON.stringify(req.body));
        }
        const repoId = String(body.repository.id);

        // Log parsed body and repoId
        console.log('Parsed webhook body:', body);
        console.log('Extracted repoId:', repoId);

        // Get repo and secret
        const repo = await prisma.repo.findUnique({ where: { githubRepoId: repoId } });
        console.log('Repo lookup result:', repo);

        if (!repo) {
            console.warn('Repo not found for repoId:', repoId);
            return res.status(404).json({ error: 'Repo not found' });
        }

        if (!verifySignature(repo.webhookSecret, rawPayload, signature)) {
            console.warn('Invalid signature for repo:', repoId);
            return res.status(401).json({ error: 'Invalid signature' });
        }


        if (event === 'pull_request' && ['opened', 'synchronize', 'reopened'].includes(body.action)) {
            console.log('Handling pull_request event:', body.action);
            await handlePullRequestEvent(body, repo);
        } else {
            console.log('Event not handled:', event, body.action);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error('Error handling webhook:', err);
        res.status(500).json({ error: 'Webhook error' });
    }
});

export default router;
