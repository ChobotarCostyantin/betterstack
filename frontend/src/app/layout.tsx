import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import React from 'react';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'betterstack',
    description: 'SEO project',
    openGraph: {
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech',
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech',
    ),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
            >
                <Header />

                <main className="flex-1">{children}</main>

                <Footer />
            </body>
        </html>
    );
}
