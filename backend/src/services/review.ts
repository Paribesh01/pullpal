import { fetchPullRequestDiff, postReviewComments } from './github';
import { PrismaClient, Repo } from '../generated/prisma';



import { GoogleGenAI } from '@google/genai';

const prisma = new PrismaClient();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Handles PR event: fetch diff, get AI feedback, post comments, store review
export async function handlePullRequestEvent(body: any, repo: Repo) {
    console.log('[handlePullRequestEvent] Start', { body, repo });
    const prNumber = body.pull_request.number;
    const owner = repo.owner;
    const name = repo.name;
    console.log('[handlePullRequestEvent] PR Info', { prNumber, owner, name });

    // Get user token
    const user = await prisma.user.findUnique({ where: { id: repo.userId } });
    console.log('[handlePullRequestEvent] User lookup', { userId: repo.userId, user });
    if (!user) throw new Error('User not found');

    // Fetch PR diff
    const diff = await fetchPullRequestDiff(owner, name, prNumber, user.githubToken);
    console.log('[handlePullRequestEvent] PR diff fetched', { diff });

    // Send to OpenAI for review
    const aiFeedback = await getAIReview(diff, { prNumber, owner, name });
    console.log('[handlePullRequestEvent] AI feedback', { aiFeedback });

    // Post comments to GitHub
    const githubComments = aiFeedback.map((item: any) => ({
        path: item.file,
        line: item.line,
        body: item.comment,
        side: 'RIGHT',
    }));
    await postReviewComments(owner, name, prNumber, githubComments, user.githubToken);
    console.log('[handlePullRequestEvent] Comments posted to GitHub');

    // Store review in DB
    await prisma.review.create({
        data: {
            prNumber,
            repoId: repo.id,
            aiFeedback,
        },
    });
    console.log('[handlePullRequestEvent] Review stored in DB');
}

// Calls Gemini API to get structured review feedback
export async function getAIReview(diff: string, meta: { prNumber: number; owner: string; name: string }) {
    console.log('[getAIReview] Start', { diff, meta });
    const prompt = `
            You are a code review assistant. Analyze the following GitHub PR diff and provide feedback as a JSON array with objects: { "file": string, "line": number, "comment": string }.

                Diff:
${diff}
`;


    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
    });
    console.log('[getAIReview] Gemini API call', { response });
    // Gemini API call

    const text = response.text || '[]';

    // Remove Markdown code block markers if present
    const cleaned = text
        .replace(/^```(?:json)?\s*/i, '') // Remove opening code block with optional 'json'
        .replace(/```\s*$/i, '') // Remove closing code block
        .trim();

    try {
        const result = JSON.parse(cleaned);
        console.log('[getAIReview] Result', { result });
        return result;
    } catch {
        console.log('[getAIReview] Error parsing JSON', { text });
        return [];
    }
}
