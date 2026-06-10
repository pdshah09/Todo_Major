"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import LogButton from "@/app/components/buttons";
import EntryField from "../components/entryField";

export default function SignInPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        router.push("/dashboard");

        const formData = new FormData(e.currentTarget);

        const res = await signIn.email({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        });

        if (res.error) {
            setError(res.error.message || "Something went wrong.");
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="min-h-screen bg-brand p-4">
            <div className="max-w-md mx-auto pt-[10vh]">
                {/* Notebook-style container */}
                <div className="bg-brand-light bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-xl border-light relative">
                    {/* Notebook Lines Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="h-full bg-gradient-to-b from-transparent via-blue-200 to-transparent bg-[length:100%_24px] bg-repeat-y" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #3b82f6 23px, #3b82f6 24px)' }}></div>
                    </div>

                    {/* Red Margin Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-red-300 opacity-30"></div>

                    <div className="relative px-8 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-canvas mb-2">Welcome back</h1>
                            <p className="text-text-muted">Sign in to continue to your tasks</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-brand border border-primary rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    {/* <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-gray-700"
                                    /> */}
                                    <EntryField 
                                        name="email" 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    {/* <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-gray-700"
                                    /> */}
                                    <EntryField 
                                        name="password" 
                                        type="password" 
                                        placeholder="Create a password (min. 8 characters)" 
                                        minLength={8}
                                        required 
                                    />
                                </div>
                            </div>

                            <LogButton text="Sign In"/>

                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-text-subtle text-sm">
                                Don&apos;t have an account?{" "}
                                <button
                                    onClick={() => router.push("/signup")}
                                    className="text-canvas hover:text-canvas font-medium hover:underline"
                                >
                                    Sign up here
                                </button>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => router.push("/")}
                                className="text-text-subtle hover:text-canvas text-sm hover:underline"
                            >
                                ← Back to home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}