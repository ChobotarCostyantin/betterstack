'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/src/api/auth/auth.api';
import { RegisterInputSchema } from '@/src/api/auth/auth.schemas';
import { browserClient } from '@/src/lib/api/browser.client';
import { HTTPError } from 'ky';

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const validationResult = RegisterInputSchema.safeParse({
            email,
            password,
        });

        if (!validationResult.success) {
            setError('Invalid email or password format');
            setIsLoading(false);
            return;
        }

        try {
            await register(browserClient, validationResult.data);
            router.push('/home');
            router.refresh();
        } catch (err) {
            if (err instanceof HTTPError) {
                const errorData = await err.response.json();
                setError(
                    'Error: ' + errorData.error.message ||
                        'Registration failed',
                );
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed. Please check your credentials');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-zinc-400"
                        >
                            Password (min 8 characters)
                        </label>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>
                {error && (
                    <div className="text-red-400 relative -top-2">{error}</div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 px-6 py-3 bg-zinc-100 text-zinc-900 font-semibold rounded-xl hover:bg-zinc-300 transition-colors duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg
                            className="animate-spin h-5 w-5 text-zinc-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Creating an account...
                    </span>
                ) : (
                    'Sign up'
                )}
            </button>
        </form>
    );
}
