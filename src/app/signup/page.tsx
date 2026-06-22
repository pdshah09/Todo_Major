// src/app/signup/page.tsx
// Guest-only. Middleware redirects authenticated users to /dashboard before render.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import LogButton from "../components/buttons";
import EntryField from "../components/entryField";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;

    if (password !== (fd.get("confirmPassword") as string)) {
      setLoading(false);
      return setError("Passwords do not match.");
    }

    const res = await signUp.email({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password,
      number: fd.get("number") as string,
      isAdmin: false,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-brand p-4">
      <div className="max-w-md mx-auto pt-[4vh]">
        <div className="bg-brand-light bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-xl border-light relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #3b82f6 23px, #3b82f6 24px)', backgroundSize: '100% 24px' }}
          />
          <div className="absolute left-6 top-0 bottom-0 w-px bg-red-300 opacity-30" />

          <div className="relative px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-canvas mb-2">Create Account</h1>
              <p className="text-text-subtle">Join us and start organizing your tasks</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-brand border border-primary rounded-lg">
                <p className="text-high-txt text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canvas mb-2">Full Name</label>
                  <EntryField name="name" type="text" required placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canvas mb-2">Phone Number (+91)</label>
                  <EntryField
                    name="number" type="tel" placeholder="10-digit mobile number"
                    maxLength={10} required
                    onInput={e => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canvas mb-2">Email Address</label>
                  <EntryField name="email" type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canvas mb-2">Password</label>
                  {/* EntryField sets id={name} internally, so id="password" resolves automatically */}
                  <EntryField name="password" type="password" placeholder="Min. 8 characters" minLength={8} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-canvas mb-2">Confirm Password</label>
                  <EntryField
                    name="confirmPassword" type="password" placeholder="Confirm your password"
                    minLength={8} required
                    onInput={e => {
                      const pwd = (document.getElementById("password") as HTMLInputElement)?.value;
                      e.currentTarget.setCustomValidity(e.currentTarget.value !== pwd ? "Passwords do not match" : "");
                    }}
                  />
                </div>
              </div>
              <LogButton text={loading ? "Creating account…" : "Create Account"} />
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-canvas font-medium hover:underline">Sign in here</Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm hover:underline">← Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
