import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import React from 'react';
import { createServerClient } from '../lib/api/server.client';
import { me } from '../api/auth/auth.api.server';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'betterstack',
    description: 'SEO project',
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech',
    ),
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const serverClient = await createServerClient();
    const user = await me(serverClient);
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
            >
                <Header user={user} />

                <main className="flex-1">{children}</main>

                <Footer />
            </body>
        </html>
    );
}
