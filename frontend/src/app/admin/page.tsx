'use client';

import { useState } from 'react';
import { forbidden, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { useAdminAuth } from './_hooks/useAdminAuth';
import { useAdminData } from './_hooks/useAdminData';
import { Sidebar } from './_components/Sidebar';
import { DataTable } from './_components/DataTable';
import { SoftwareFormModal } from './_components/SoftwareFormModal';
import { CategoryFormModal } from './_components/CategoryFormModal';
import { CriteriaFormModal } from './_components/CriteriaFormModal';
import type { Tab, TableRecord } from './types';

export default function Admin() {
    const router = useRouter();
    const status = useAdminAuth();
    const [activeTab, setActiveTab] = useState<Tab>('software');

    // Modal state management
    const [softwareModalOpen, setSoftwareModalOpen] = useState(false);
    const [softwareEditItem, setSoftwareEditItem] =
        useState<TableRecord | null>(null);

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryEditItem, setCategoryEditItem] =
        useState<TableRecord | null>(null);

    const [criteriaModalOpen, setCriteriaModalOpen] = useState(false);
    const [criteriaType, setCriteriaType] = useState<'Metric' | 'Factor'>(
        'Metric',
    );
    const [criteriaEditItem, setCriteriaEditItem] =
        useState<TableRecord | null>(null);

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

    // Handle opening add modals
    const openSoftwareModal = () => {
        setSoftwareEditItem(null);
        setSoftwareModalOpen(true);
    };

    const openCategoryModal = () => {
        setCategoryEditItem(null);
        setCategoryModalOpen(true);
    };

    const openMetricModal = () => {
        setCriteriaType('Metric');
        setCriteriaEditItem(null);
        setCriteriaModalOpen(true);
    };

    const openFactorModal = () => {
        setCriteriaType('Factor');
        setCriteriaEditItem(null);
        setCriteriaModalOpen(true);
    };

    // Handle opening edit modals
    const handleEditSoftware = (item: TableRecord) => {
        setSoftwareEditItem(item);
        setSoftwareModalOpen(true);
    };

    const handleEditCategory = (item: TableRecord) => {
        setCategoryEditItem(item);
        setCategoryModalOpen(true);
    };

    const handleEditMetric = (item: TableRecord) => {
        setCriteriaType('Metric');
        setCriteriaEditItem(item);
        setCriteriaModalOpen(true);
    };

    const handleEditFactor = (item: TableRecord) => {
        setCriteriaType('Factor');
        setCriteriaEditItem(item);
        setCriteriaModalOpen(true);
    };

    // Handle modal success
    const handleSoftwareSuccess = (newItem: TableRecord) => {
        if (softwareEditItem) {
            // Update existing item
            setData((prev) =>
                prev.map((item) => (item.id === newItem.id ? newItem : item)),
            );
        } else {
            // Add new item
            setData((prev) => [newItem, ...prev]);
        }
        setSoftwareModalOpen(false);
        setSoftwareEditItem(null);
    };

    const handleCategorySuccess = (newItem: TableRecord) => {
        if (categoryEditItem) {
            // Update existing item
            setData((prev) =>
                prev.map((item) => (item.id === newItem.id ? newItem : item)),
            );
        } else {
            // Add new item
            setData((prev) => [newItem, ...prev]);
        }
        setCategoryModalOpen(false);
        setCategoryEditItem(null);
    };

    const handleCriteriaSuccess = (newItem: TableRecord) => {
        if (criteriaEditItem) {
            // Update existing item
            setData((prev) =>
                prev.map((item) => (item.id === newItem.id ? newItem : item)),
            );
        } else {
            // Add new item
            setData((prev) => [newItem, ...prev]);
        }
        setCriteriaModalOpen(false);
        setCriteriaEditItem(null);
    };

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
                                        onClick={openMetricModal}
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
                                    onEditMetric={handleEditMetric}
                                    onEditFactor={handleEditFactor}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-zinc-200">
                                        Factors
                                    </h3>
                                    <button
                                        onClick={openFactorModal}
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
                                    onEditMetric={handleEditMetric}
                                    onEditFactor={handleEditFactor}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab !== 'user' && (
                                <div>
                                    <button
                                        onClick={
                                            activeTab === 'software'
                                                ? openSoftwareModal
                                                : openCategoryModal
                                        }
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
                                onEditSoftware={handleEditSoftware}
                                onEditCategory={handleEditCategory}
                            />
                        </>
                    )}
                </div>
            </main>

            {/* Software Modal */}
            <SoftwareFormModal
                isOpen={softwareModalOpen}
                isEditing={!!softwareEditItem}
                item={softwareEditItem}
                onClose={() => {
                    setSoftwareModalOpen(false);
                    setSoftwareEditItem(null);
                }}
                onSuccess={handleSoftwareSuccess}
            />

            {/* Category Modal */}
            <CategoryFormModal
                isOpen={categoryModalOpen}
                isEditing={!!categoryEditItem}
                item={categoryEditItem}
                onClose={() => {
                    setCategoryModalOpen(false);
                    setCategoryEditItem(null);
                }}
                onSuccess={handleCategorySuccess}
            />

            {/* Criteria Modal */}
            <CriteriaFormModal
                isOpen={criteriaModalOpen}
                isEditing={!!criteriaEditItem}
                criteriaType={criteriaType}
                item={criteriaEditItem}
                onClose={() => {
                    setCriteriaModalOpen(false);
                    setCriteriaEditItem(null);
                }}
                onSuccess={handleCriteriaSuccess}
            />
        </div>
    );
}
