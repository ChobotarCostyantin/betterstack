import Link from 'next/link';

export default function Forbidden() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="relative flex items-center justify-center mb-10 w-full">
                <h1 className="text-[150px] md:text-[250px] font-extrabold text-zinc-800/50 leading-none select-none absolute">
                    403
                </h1>

                <div className="relative z-10 flex flex-col items-center mt-12 md:mt-16">
                    <span className="px-4 py-1 text-[12px] font-medium uppercase tracking-widest text-zinc-400 border border-zinc-800 bg-[#111114] rounded-full mb-6 shadow-sm">
                        Error 403
                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Access is denied
                    </h2>

                    <p className="text-lg text-zinc-500 max-w-md">
                        Sorry, but you need administrator rights to view this
                        page.
                    </p>
                </div>
            </div>

            <Link
                href="/home"
                className="relative z-10 px-6 py-3 rounded-xl bg-zinc-200 text-[#09090b] font-medium hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
                Return to the main page
            </Link>
        </div>
    );
}
