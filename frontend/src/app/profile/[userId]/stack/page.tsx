import { createServerClient } from '@/src/lib/api/server.client';
import { getUserStack } from '@/src/api/users/users.api';
import { me } from '@/src/api/auth/auth.api.server';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import { absoluteUrl } from '@/src/lib/url';
import StackGrid from './_components/StackGrid';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    return {
        title: 'Tech Stack | betterstack',
        alternates: { canonical: absoluteUrl(`/profile/${userId}/stack`) },
    };
}

export default async function StackPage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    const targetUserId = parseInt(userId, 10);

    const serverClient = await createServerClient();

    const [stack, currentUser] = await Promise.all([
        getUserStack(serverClient, targetUserId).catch(() => []),
        me(serverClient).catch(() => null),
    ]);

    const isOwner = currentUser?.id === targetUserId;

    if (stack.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="w-12 h-12 text-zinc-600 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    {isOwner ? 'Your stack is empty' : 'Stack is empty'}
                </h2>
                <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                    {isOwner
                        ? 'Browse the catalog and mark software as "used" to build your personal stack.'
                        : 'This user has not added any software to their stack yet.'}
                </p>
                {isOwner && (
                    <Link
                        href="/catalog"
                        className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                    >
                        Browse Catalog
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                    {isOwner ? 'My Stack' : 'Tech Stack'}
                </h2>
                <span className="text-sm text-zinc-500">
                    {stack.length} item{stack.length !== 1 ? 's' : ''}
                </span>
            </div>

            <StackGrid initialStack={stack} isOwner={isOwner} />
        </div>
    );
}
