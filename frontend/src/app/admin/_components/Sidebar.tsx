import type { Tab } from '../types';

interface SidebarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const tabs: Tab[] = ['software', 'category', 'criteria', 'user'];

    return (
        <aside className="w-60 shrink-0 flex flex-col gap-y-2">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-5">
                Menu
            </h1>
            <nav className="flex flex-col gap-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-x-3 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer capitalize ${
                            activeTab === tab
                                ? 'bg-zinc-800/80 text-zinc-100 shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
