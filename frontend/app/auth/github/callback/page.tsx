"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const hasRunRef = useRef<string | null>(null);

  useEffect(() => {
    if (!code) {
      router.push("/");
      return;
    }
    // Only run if we haven't run for this code yet
    if (hasRunRef.current === code) return;
    hasRunRef.current = code;

    fetch(`http://localhost:3001/auth/github/callback?code=${code}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Auth failed");
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/dashboard");
      })
      .catch((e) => {
        console.error(e);
        alert("Authentication failed");
        router.push("/");
      });
  }, [code, router]);

  return <div>Signing you in with GitHub...</div>;
}
