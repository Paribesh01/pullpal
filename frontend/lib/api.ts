export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function fetchUserRepos(token: string) {
    const res = await fetch(`${BACKEND_URL}/auth/github/repos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch repos");
    return res.json();
}