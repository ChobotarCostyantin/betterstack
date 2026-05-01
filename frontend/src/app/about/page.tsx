import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { absoluteUrl } from '@/src/lib/url';

export const metadata: Metadata = {
    title: 'About | BetterStack',
    description:
        'Information about the project, authors, and technology stack.',
    alternates: { canonical: absoluteUrl('/about') },
};

const projectRepo = 'https://github.com/TeseySTD/betterstack';

const authors = [
    { name: 'Skoreiko Mykhailo', href: 'https://github.com/TeseySTD' },
    {
        name: 'Chobotar Kostiantyn',
        href: 'https://github.com/ChobotarCostyantin',
    },
    { name: 'Ratushniak Mykola', href: 'https://github.com/staleread' },
    { name: 'Nykolaichuk Vladyslav', href: 'https://github.com/C0ldarm' },
];

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <section className="relative pb-20 pt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-zinc-600/10 blur-[140px] pointer-events-none" />

                <div className="relative z-10 text-center px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500" />
                        </span>
                        v1.0 is now live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 pb-2 px-2 bg-linear-to-b from-zinc-200 to-zinc-400/30 bg-clip-text text-transparent">
                        The Ultimate Tech{' '}
                        <span className="block">Stack Directory</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
                        The betterstack platform helps developers and teams
                        discover, compare, and choose the most effective
                        software solutions for modern web development.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/catalog"
                            className="px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-xl shadow-blue-500/10"
                        >
                            Explore Catalog
                        </Link>

                        <Link
                            href="/comparison"
                            className="px-8 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
                        >
                            Compare Tools
                        </Link>

                        <Link
                            href={projectRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold"
                        >
                            <Image
                                src="/github-logo.svg"
                                alt="GitHub"
                                width={20}
                                height={20}
                                className="not-dark:invert opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mb-24 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-left">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Why betterstack?
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Choosing the right tool is the hardest part of any
                            project. We built BetterStack to simplify this
                            process by providing structured data, community
                            insights, and technical metrics in one place.
                        </p>
                        <ul className="space-y-4">
                            {[
                                {
                                    t: 'Unbiased Reviews',
                                    d: 'Expert analysis focused on performance and scalability.',
                                },
                                {
                                    t: 'Live Comparisons',
                                    d: 'Side-by-side technical specification matching.',
                                },
                                {
                                    t: 'Modern Stack',
                                    d: 'Always up-to-date with the latest industry shifts.',
                                },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-zinc-500/20 border border-zinc-500/40 flex items-center justify-center shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                                    </div>
                                    <div>
                                        <span className="font-bold block text-foreground">
                                            {item.t}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {item.d}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/comparison"
                        className="relative group block cursor-pointer"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                        <div className="relative p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 aspect-video flex flex-col items-center justify-center transition-transform group-hover:scale-[1.02]">
                            <div className="text-center space-y-4">
                                <div className="text-3xl md:text-4xl font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tighter">
                                    Live Comparison
                                </div>
                                <p className="text-sm font-medium text-zinc-500 flex items-center justify-center gap-2">
                                    Try the tool now{' '}
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            <section className="mb-24 px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
                    Technical Integrity
                </h2>
                <div className="space-y-4">
                    <details className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-6 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                        <summary className="font-bold text-lg flex justify-between items-center outline-none">
                            SEO & Core Web Vitals
                            <span className="transition group-open:rotate-180 text-zinc-500">
                                ▼
                            </span>
                        </summary>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Every tool in our directory is evaluated not just on
                            features, but on real-world performance. We analyze
                            rendering strategies, LCP/CLS metrics, and
                            structured data implementation (Schema.org) to
                            ensure your chosen stack can achieve maximum search
                            visibility.
                        </p>
                    </details>

                    <details className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-6 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                        <summary className="font-bold text-lg flex justify-between items-center outline-none">
                            Architecture & Micro-segmentation
                            <span className="transition group-open:rotate-180 text-zinc-500">
                                ▼
                            </span>
                        </summary>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Our database is built with precise
                            micro-segmentation. We categorize software by exact
                            use-cases, API integrations, and component
                            architecture so that your search intent directly
                            matches the technical solutions we provide.
                        </p>
                    </details>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-12 bg-zinc-800" />
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
                        Developed By
                    </h2>
                    <div className="h-px w-12 bg-zinc-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authors.map((author) => (
                        <Link
                            key={author.href}
                            href={author.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl"
                        >
                            <div className="flex justify-between items-center relative z-10">
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400 opacity-80">
                                        Author
                                    </span>
                                    <h3 className="text-xl font-bold text-foreground group-hover:translate-x-1 transition-transform duration-300">
                                        {author.name}
                                    </h3>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-zinc-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative">
                                        <Image
                                            src="/github-logo.svg"
                                            alt="GitHub"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            </div>

                            <span className="absolute -bottom-4 -left-2 text-6xl font-black text-foreground/3 pointer-events-none select-none uppercase transition-all group-hover:text-foreground/5">
                                {author.name.split(' ')[0]}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mb-24 mt-16 px-4">
                <div className="relative p-10 md:p-16 rounded-3xl bg-zinc-900 overflow-hidden text-center">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6 tracking-tight">
                            Ready to optimize your stack?
                        </h2>
                        <Link
                            href="/catalog"
                            className="inline-flex px-8 py-4 rounded-2xl bg-white text-zinc-900 font-bold hover:scale-105 transition-transform shadow-2xl"
                        >
                            Start Exploring
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
