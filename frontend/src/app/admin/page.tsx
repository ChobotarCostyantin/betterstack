'use client';

import { useState } from 'react';
import { forbidden, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { useAdminAuth } from './_hooks/useAdminAuth';
import { useAdminData } from './_hooks/useAdminData';
import { Sidebar } from './_components/Sidebar';
import { DataTable } from './_components/DataTable';
import type { Tab } from './types';

export default function Admin() {
    const router = useRouter();
    const status = useAdminAuth();
    const [activeTab, setActiveTab] = useState<Tab>('software');

    const {
        data,
        setData,
        isLoading,
        isRefetching,
        refetch,
        isFetchingNextPage,
        hasMore,
        loadMore,
    } = useAdminData(activeTab, status === 'authorized');

    if (status === 'forbidden') {
        forbidden();
    }

    if (status === 'loading') {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-zinc-500 animate-pulse text-lg font-medium">
                    Checking access...
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-73px)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 flex flex-col bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 md:p-8 flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-white capitalize mb-4">
                        {activeTab} Management
                    </h2>

                    {activeTab === 'criteria' ? (
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-zinc-200">
                                        Metrics
                                    </h3>
                                    <button
                                        onClick={() =>
                                            console.log('Add Metric Modal')
                                        }
                                        className="flex items-center gap-x-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add Metric
                                    </button>
                                </div>
                                <DataTable
                                    data={data.filter(
                                        (item) => item.type === 'Metric',
                                    )}
                                    setData={setData}
                                    isLoading={isLoading}
                                    isRefetching={isRefetching}
                                    activeTab={activeTab}
                                    onRefetch={refetch}
                                    isFetchingNextPage={isFetchingNextPage}
                                    hasMore={hasMore}
                                    onLoadMore={loadMore}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-zinc-200">
                                        Factors
                                    </h3>
                                    <button
                                        onClick={() =>
                                            console.log('Add Factor Modal')
                                        }
                                        className="flex items-center gap-x-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add Factor
                                    </button>
                                </div>
                                <DataTable
                                    data={data.filter(
                                        (item) => item.type === 'Factor',
                                    )}
                                    setData={setData}
                                    isLoading={isLoading}
                                    isRefetching={isRefetching}
                                    activeTab={activeTab}
                                    onRefetch={refetch}
                                    isFetchingNextPage={isFetchingNextPage}
                                    hasMore={hasMore}
                                    onLoadMore={loadMore}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab !== 'user' && (
                                <div>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="flex items-center gap-x-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add {activeTab}
                                    </button>
                                </div>
                            )}

                            <DataTable
                                data={data}
                                setData={setData}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                activeTab={activeTab}
                                onRefetch={refetch}
                                isFetchingNextPage={isFetchingNextPage}
                                hasMore={hasMore}
                                onLoadMore={loadMore}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
