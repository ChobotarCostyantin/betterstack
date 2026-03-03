import Link from 'next/link';
import { Software } from '@/src/lib/types';

const CATEGORY_MAP: Record<number, string> = {
    1: 'Frameworks',
    2: 'Databases',
    3: 'CSS Tools',
    4: 'Languages',
};

interface FeaturedCardProps {
    item: Software;
}

export default function FeaturedCard({ item }: FeaturedCardProps) {
    return (
        <Link
            href={`/article/${item.id}`}
            className="w-full md:w-[calc(33.333%-11px)] p-6 rounded-2xl bg-[#111114] border border-zinc-800 hover:border-zinc-700 transition-colors group flex flex-col"
        >
            <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="text-lg font-medium text-white group-hover:text-zinc-200 transition-colors">
                    {item.name}
                </h3>

                {item.categoryIds && item.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end shrink-0">
                        {item.categoryIds.map((id) => (
                            <span
                                key={id}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wider"
                            >
                                {CATEGORY_MAP[id] || `Unknown #${id}`}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-sm text-zinc-400">{item.shortDescription}</p>
        </Link>
    );
}
