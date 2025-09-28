export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function fetchUserRepos() {
    const res = await fetch(`${BACKEND_URL}/auth/github/repos`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error("Failed to fetch repos");
    return res.json();
}