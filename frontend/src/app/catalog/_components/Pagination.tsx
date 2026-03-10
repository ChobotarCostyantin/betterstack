'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        const newUrl = params.toString()
            ? `/catalog?${params.toString()}`
            : '/catalog';
        router.push(newUrl, { scroll: true });
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-zinc-800/50">
            {currentPage > 1 && (
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Previous
                </button>
            )}

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    return (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-xl transition-colors ${
                                isActive
                                    ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {currentPage < totalPages && (
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Next
                </button>
            )}
        </div>
    );
}
