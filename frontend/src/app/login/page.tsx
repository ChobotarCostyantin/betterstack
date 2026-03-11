import { Metadata } from 'next';
import LoginForm from './_components/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Login | betterstack',
    description: 'Sign in to your BetterStack account',
};

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
            <div className="w-full max-w-md p-8 sm:p-10 border border-zinc-800 rounded-2xl bg-zinc-900/20 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-800 via-zinc-500 to-zinc-800 opacity-50"></div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Welcome back
                    </h1>
                    <p className="text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            className="text-zinc-300 hover:text-white underline decoration-zinc-600 hover:decoration-zinc-400 underline-offset-4 transition-all"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
