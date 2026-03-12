import Link from 'next/link';

const footerLinks = [
    {
        category: 'Built with',
        links: [
            { name: 'Next.js', href: 'https://nextjs.org/' },
            { name: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
            { name: 'Nest.js', href: 'https://nestjs.com/' },
            { name: 'TypeScript', href: 'https://www.typescriptlang.org/' },
        ],
    },
    {
        category: 'Contributors',
        links: [
            { name: 'Skoreiko', href: 'https://github.com/TeseySTD' },
            { name: 'Chobotar', href: 'https://github.com/ChobotarCostyantin' },
            { name: 'Ratushniak', href: 'https://github.com/staleread' },
            { name: 'Nykolaichuk', href: 'https://github.com/C0ldarm' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="w-full text-zinc-400 bg-linear-[180deg,#111114,#09090b] border-t border-zinc-800 overflow-hidden relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-30 sm:pb-48 pt-10 sm:pt-16 relative z-5">
                <ul className="space-y-4 max-w-3xl mx-auto">
                    {footerLinks.map((item, index) => (
                        <li
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between w-full text-sm sm:text-base pb-5 gap-y-3 sm:gap-y-0"
                        >
                            <span className="whitespace-nowrap text-zinc-300">
                                {item.category}
                            </span>

                            <div className="w-full sm:w-auto sm:grow border-b border-dashed border-zinc-500/60 sm:mx-4 relative sm:-top-1" />

                            <div className="flex flex-wrap justify-start sm:justify-end gap-x-2 gap-y-1">
                                {item.links.map((link, linkIndex) => (
                                    <div
                                        key={linkIndex}
                                        className="flex items-center gap-x-2"
                                    >
                                        <Link
                                            href={link.href}
                                            target="_blank"
                                            className="hover:text-white transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                        {linkIndex < item.links.length - 1 && (
                                            <span className="text-zinc-700 select-none">
                                                /
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none select-none overflow-hidden translate-y-[20%]">
                <span className="text-[clamp(4.5rem,13.5vw,12rem)] font-bold leading-none tracking-tight bg-linear-to-b from-zinc-800 to-zinc-950 text-transparent bg-clip-text">
                    betterstack
                </span>
            </div>
        </footer>
    );
}
