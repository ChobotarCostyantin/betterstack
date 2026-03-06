import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full bg-linear-[90deg,#09090b80,#11111480] z-999 border-b border-zinc-800 shadow-lg sticky top-0 backdrop-blur-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="shrink-0">
                    <Link
                        href="/home"
                        className="text-2xl font-bold tracking-wide hover:text-gray-400 transition-colors"
                    >
                        betterstack
                    </Link>
                </div>

                <div className="flex items-center gap-x-8">
                    <NavLink href="/comparison">Comparison</NavLink>
                    <NavLink href="">Login</NavLink>
                </div>
            </nav>
        </header>
    );
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
        href={href}
        className="text-base font-medium transition-colors duration-300 hover:text-gray-400 relative group"
    >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
);
