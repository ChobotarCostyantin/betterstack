import SearchBar from '@/src/app/home/_components/SearchBar';
import { getFeaturedAction } from '@/src/lib/api';
import FeaturedCard from '@/src/app/home/_components/FeaturedCard';

export default async function Home() {
    const featuredSoftware = await getFeaturedAction();

    return (
        <div className="flex flex-col items-center min-h-[70vh] px-4 pt-32 pb-16">
            <div className="text-center mb-10 w-full">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                    Find the perfect{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-600">
                        stack
                    </span>
                </h1>
                <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                    Search through our database of software, libraries, and
                    tools to build your next big project.
                </p>
            </div>

            <SearchBar />

            <div className="mt-24 w-full max-w-4xl">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6 text-center">
                    Popular software
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {featuredSoftware.map((item) => (
                        <FeaturedCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
