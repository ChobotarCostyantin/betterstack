import Link from 'next/link';

export default function Pagination({
    currentPage,
    totalPages,
    searchParams,
}: {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string | string[] | undefined>;
}) {
    if (totalPages <= 1) return null;

    const getPageHref = (page: number) => {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(searchParams)) {
            if (key === 'page' || value === undefined) continue;

            if (typeof value === 'string') {
                params.set(key, value);
                continue;
            }

            for (const item of value) {
                params.append(key, item);
            }
        }

        if (page > 1) {
            params.set('page', page.toString());
        }

        return params.toString() ? `/catalog?${params.toString()}` : '/catalog';
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-zinc-800/50">
            {currentPage > 1 && (
                <Link
                    href={getPageHref(currentPage - 1)}
                    rel="prev"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Previous
                </Link>
            )}

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    const className = `w-10 h-10 flex items-center justify-center text-sm font-medium rounded-xl transition-colors ${
                        isActive
                            ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                    }`;
                    if (isActive) {
                        return (
                            <span
                                key={page}
                                aria-current="page"
                                className={className}
                            >
                                {page}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={page}
                            href={getPageHref(page)}
                            className={className}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {currentPage < totalPages && (
                <Link
                    href={getPageHref(currentPage + 1)}
                    rel="next"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Next
                </Link>
            )}
        </div>
    );
}
