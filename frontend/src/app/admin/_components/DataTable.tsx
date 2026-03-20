import { Edit, Trash2, BadgeInfoIcon, Loader2 } from 'lucide-react';
import type { TableRecord, Tab } from '../types';
import { useRouter } from 'next/navigation';
import { useState, UIEvent, Dispatch, SetStateAction } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { UserRoleFormModal } from '@/src/app/admin/_components/UserRoleFormModal';

interface DataTableProps {
    data: TableRecord[];
    setData?: Dispatch<SetStateAction<TableRecord[]>>;
    isLoading: boolean;
    isRefetching?: boolean;
    activeTab: Tab;
    onRefetch: () => void;
    isFetchingNextPage?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onEditSoftware?: (item: TableRecord) => void;
    onEditCategory?: (item: TableRecord) => void;
    onEditMetric?: (item: TableRecord) => void;
    onEditFactor?: (item: TableRecord) => void;
    onEditAuthor?: (item: TableRecord) => void;
}

export function DataTable({
    data,
    setData,
    isLoading,
    isRefetching,
    activeTab,
    isFetchingNextPage,
    hasMore,
    onLoadMore,
    onEditSoftware,
    onEditCategory,
    onEditMetric,
    onEditFactor,
    onEditAuthor,
}: DataTableProps) {
    const router = useRouter();
    const [pickedItem, setPickedItem] = useState<TableRecord | null>(null);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            if (hasMore && !isFetchingNextPage && onLoadMore) {
                onLoadMore();
            }
        }
    };

    if (isLoading && (!data || data.length === 0)) {
        return (
            <div className="text-zinc-500 animate-pulse p-8 text-center">
                Loading data...
            </div>
        );
    }

    if (!isLoading && (!data || data.length === 0)) {
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

    const entityName = pickedItem?.type ? String(pickedItem.type) : activeTab;

    return (
        <div
            className={`overflow-auto max-h-[60vh] border border-zinc-800/80 rounded-xl bg-[#09090b]/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent relative transition-opacity duration-300 ${isRefetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            onScroll={handleScroll}
        >
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 z-10">
                    <tr className="border-b border-zinc-800 bg-[#111114] text-zinc-400 text-sm">
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
                                            onClick={() => {
                                                if (
                                                    activeTab === 'software' &&
                                                    onEditSoftware
                                                ) {
                                                    onEditSoftware(row);
                                                } else if (
                                                    activeTab === 'category' &&
                                                    onEditCategory
                                                ) {
                                                    onEditCategory(row);
                                                } else if (
                                                    activeTab === 'author' &&
                                                    onEditAuthor
                                                ) {
                                                    onEditAuthor(row);
                                                } else if (
                                                    activeTab === 'criteria'
                                                ) {
                                                    if (
                                                        row.type === 'Metric' &&
                                                        onEditMetric
                                                    ) {
                                                        onEditMetric(row);
                                                    } else if (
                                                        row.type === 'Factor' &&
                                                        onEditFactor
                                                    ) {
                                                        onEditFactor(row);
                                                    }
                                                }
                                            }}
                                            className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPickedItem(row)}
                                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setPickedItem(row)}
                                        className="p-1.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-400/10 rounded-md transition-colors"
                                        title="Edit Role"
                                    >
                                        <Edit size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4 text-zinc-500 gap-x-2 border-t border-zinc-800/50">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Loading more...</span>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={!!pickedItem && activeTab !== 'user'}
                entityName={entityName}
                onClose={() => setPickedItem(null)}
                pickedItem={pickedItem}
                activeTab={activeTab}
                setData={setData}
            />

            <UserRoleFormModal
                isOpen={!!pickedItem && activeTab === 'user'}
                onClose={() => setPickedItem(null)}
                pickedItem={pickedItem}
                setData={setData}
            />
        </div>
    );
}
