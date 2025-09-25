import fetch from 'node-fetch';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI,
} = process.env;

/**
 * Generates the GitHub OAuth consent URL.
 */
export function getGitHubOAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID!,
        redirect_uri: GITHUB_REDIRECT_URI!,
        scope: 'repo',
        allow_signup: 'true',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchanges the OAuth code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: GITHUB_REDIRECT_URI,
        }),
    });

    const data = await response.json() as any;
    if (!data.access_token) {
        throw new Error('Failed to obtain access token');
    }
    return data.access_token;
}

/**
 * Fetches the authenticated user's repositories.
 */
export async function fetchUserRepos(token: string): Promise<any[]> {
    const response = await fetch('https://api.github.com/user/repos', {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user repositories');
    }
    return response.json() as any;
}

/**
 * Creates a new issue in the specified repository.
 */
export async function createIssueInRepo(
    token: string,
    owner: string,
    repo: string,
    title: string,
    body: string
): Promise<any> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
            method: 'POST',
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github+json',
            },
            body: JSON.stringify({ title, body }),
        }
    );
    if (!response.ok) {
        throw new Error('Failed to create issue');
    }
    return response.json();
}

// Fetch PR diff from GitHub
export async function fetchPullRequestDiff(owner: string, repo: string, prNumber: number, token: string): Promise<string> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const res = await axios.get(url, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3.diff',
        },
    });
    return res.data;
}

// Post review comments to GitHub
export async function postReviewComments(
    owner: string,
    repo: string,
    prNumber: number,
    comments: { path: string; line: number; body: string }[],
    token: string
) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`;
    // If too many comments, group into one summary
    if (comments.length > 20) {
        const summary = comments.map(c => `File: ${c.path}, Line: ${c.line}\n${c.body}`).join('\n\n');
        await axios.post(
            url,
            { body: summary, event: 'COMMENT' },
            { headers: { Authorization: `token ${token}` } }
        );
    } else {
        // Post each comment individually
        for (const comment of comments) {
            await axios.post(
                url,
                {
                    body: comment.body,
                    event: 'COMMENT',
                    comments: [{ path: comment.path, line: comment.line, body: comment.body }],
                },
                { headers: { Authorization: `token ${token}` } }
            );
        }
    }
}
