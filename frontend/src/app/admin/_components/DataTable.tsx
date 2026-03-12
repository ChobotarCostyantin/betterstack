import { Edit, Trash2, BadgeInfoIcon, UserPlus } from 'lucide-react';
import type { TableRecord, Tab } from '../types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteSoftware } from '@/src/api/software/software.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { deleteCategory } from '@/src/api/categories/categories.api';
import { makeAdmin } from '@/src/api/users/users.api';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { MakeUserAdminModal } from '@/src/app/admin/_components/MakeUserAdminModal';
import { deleteFactor, deleteMetric } from '@/src/api/criteria/criteria.api';

interface DataTableProps {
    data: TableRecord[];
    isLoading: boolean;
    activeTab: Tab;
    onRefetch: () => void;
}

export function DataTable({
    data,
    isLoading,
    activeTab,
    onRefetch,
}: DataTableProps) {
    const router = useRouter();
    const [pickedItem, setPickedItem] = useState<TableRecord | null>(null);

    if (isLoading) {
        return (
            <div className="text-zinc-500 animate-pulse">Loading data...</div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-zinc-800 border-dashed rounded-xl bg-[#09090b]/50">
                <div className="text-zinc-500 mb-4">No data found</div>
            </div>
        );
    }

    const allKeys = new Set<string>();
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if (key === 'type') return;

            const val = row[key];
            if (typeof val !== 'object' || val === null || Array.isArray(val)) {
                allKeys.add(key);
            }
        });
    });
    const columns = Array.from(allKeys);

    const renderCellValue = (val: unknown) => {
        if (val === null || val === undefined)
            return <span className="text-zinc-600">-</span>;

        if (Array.isArray(val)) {
            if (val.length === 0)
                return <span className="text-zinc-600">-</span>;
            if (typeof val[0] === 'object' && val[0] !== null) {
                return (val as TableRecord[])
                    .map((item) =>
                        String(item.name || item.title || item.slug || '...'),
                    )
                    .join(', ');
            }
            return val.join(', ');
        }

        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        return String(val);
    };

    const handleConfirmDelete = async () => {
        if (!pickedItem || !pickedItem.id) return;

        try {
            const id = Number(pickedItem.id);

            if (activeTab === 'software') {
                await deleteSoftware(browserClient, id);
            } else if (activeTab === 'category') {
                await deleteCategory(browserClient, id);
            } else if (activeTab === 'criteria') {
                if (pickedItem.type === 'Metric') {
                    await deleteMetric(browserClient, id);
                } else if (pickedItem.type === 'Factor') {
                    await deleteFactor(browserClient, id);
                }
            }

            onRefetch();
        } catch (error) {
            console.error('Failed to delete item:', error);
        } finally {
            setPickedItem(null);
        }
    };

    const handleMakeUserAdmin = async () => {
        if (!pickedItem) return;

        try {
            await makeAdmin(browserClient, Number(pickedItem.id));
            onRefetch();
        } catch (error) {
            console.error('Failed to make user admin:', error);
        } finally {
            setPickedItem(null);
        }
    };

    const entityName = pickedItem?.type ? String(pickedItem.type) : activeTab;

    return (
        <div className="overflow-x-auto border border-zinc-800/80 rounded-xl bg-[#09090b]/50">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm">
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="p-4 font-semibold capitalize"
                            >
                                {col}
                            </th>
                        ))}
                        <th className="p-4 font-semibold text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="border-b border-zinc-800/50 hover:bg-zinc-800/40 text-zinc-300 text-sm transition-colors group"
                        >
                            {columns.map((col) => (
                                <td key={col} className="p-4">
                                    {renderCellValue(row[col])}
                                </td>
                            ))}

                            <td className="p-4 flex items-center justify-end gap-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                {activeTab === 'software' && (
                                    <button
                                        onClick={() =>
                                            router.push(`/article/${row.slug}`)
                                        }
                                        className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                        title="Full info"
                                    >
                                        <BadgeInfoIcon size={16} />
                                    </button>
                                )}

                                {activeTab !== 'user' ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                console.log(
                                                    'Edit item:',
                                                    row.slug || row.id,
                                                )
                                            }
                                            className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPickedItem(row)}
                                            className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                ) : (
                                    row['role'] === 'user' && (
                                        <button
                                            onClick={() => setPickedItem(row)}
                                            className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                            title="Upgrade"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeleteConfirmModal
                isOpen={!!pickedItem}
                entityName={entityName}
                onClose={() => setPickedItem(null)}
                onConfirm={handleConfirmDelete}
            />

            <MakeUserAdminModal
                isOpen={!!pickedItem}
                onClose={() => setPickedItem(null)}
                onConfirm={handleMakeUserAdmin}
            />
        </div>
    );
}
