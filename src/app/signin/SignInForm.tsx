// src/app/signin/SignInForm.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import LogButton from "@/app/components/buttons";
import EntryField from "../components/entryField";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const res = await signIn.email({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      rememberMe: true,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      const cb = params.get("callbackUrl");
      router.replace(cb && cb.startsWith("/") ? cb : "/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-brand p-4">
      <div className="max-w-md mx-auto pt-[10vh]">
        <div className="bg-brand-light bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-xl border-light relative">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 23px, #3b82f6 23px, #3b82f6 24px)",
              backgroundSize: "100% 24px",
            }}
          />
          <div className="absolute left-6 top-0 bottom-0 w-px bg-red-300 opacity-30" />

          <div className="relative px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-canvas mb-2">Welcome back</h1>
              <p className="text-text-muted">Sign in to continue to your tasks</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-brand border border-primary rounded-lg">
                <p className="text-high-txt text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <EntryField name="email" type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <EntryField name="password" type="password" placeholder="Your password" minLength={8} required />
                </div>
              </div>
              <LogButton text={loading ? "Signing in…" : "Sign In"} />
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-subtle text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-canvas font-medium hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-text-subtle hover:text-canvas text-sm hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
