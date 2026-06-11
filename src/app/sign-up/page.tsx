"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import LogButton from "../components/buttons";
import EntryField from "../components/entryField";

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        if (password !== (formData.get("confirmPassword") as string)) {
            return setError("Passwords do not match.");
        }

        const res = await signUp.email({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password,
            number: formData.get("number") as string,
            isAdmin: false,
        });

        if (res.error) {
            setError(res.error.message || "Something went wrong.");
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="min-h-screen bg-brand p-4">
            <div className="max-w-md mx-auto pt-[4vh]">
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
                                    <label htmlFor="name" className="block text-sm font-medium text-canvas mb-2">
                                        Full Name
                                    </label>
                                    {/* <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-gray-700"
                                    /> */}
                                    <EntryField name="name" type="text" required placeholder="Enter your full name" />
                                </div>
                                <div>
                                    <label htmlFor="number" className="block text-sm font-medium text-canvas mb-2">
                                        Phone Number (+91)
                                    </label>
                                    {/* <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password (min. 8 characters)"
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-gray-700"
                                    /> */}
                                    <EntryField
                                        name="number"
                                        type="tel"
                                        placeholder="1234567890"
                                        maxLength={10}
                                        onInput={
                                            (e) => {
                                                e.currentTarget.value = e.currentTarget.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 10);
                                            }
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-canvas mb-2">
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
                                    <label htmlFor="password" className="block text-sm font-medium text-canvas mb-2">
                                        Password
                                    </label>
                                    {/* <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password (min. 8 characters)"
                                        required
                                        minLength={8}
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
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-canvas mb-2">
                                        Confirm Password
                                    </label>
                                    <EntryField 
                                        name="confirmPassword" 
                                        type="password" 
                                        placeholder="Confirm your password" 
                                        minLength={8}
                                        onInput={(e) => {
                                            const pwd =
                                                (document.getElementById('password') as HTMLInputElement)?.value;

                                            e.currentTarget.setCustomValidity(
                                                e.currentTarget.value !== pwd
                                                    ? 'Passwords do not match'
                                                    : ''
                                            );
                                        }}
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <LogButton text="Create Account"/>

                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <button
                                    onClick={() => router.push("/sign-in")}
                                    className="text-canvas hover:text-canvas font-medium hover:underline"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => router.push("/")}
                                className="text-gray-500 hover:text-gray-700 text-sm hover:underline"
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