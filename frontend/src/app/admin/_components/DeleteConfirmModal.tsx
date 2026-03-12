import React, { Dispatch, SetStateAction } from 'react';
import type { TableRecord, Tab } from '../types';
import { deleteSoftware } from '@/src/api/software/software.api';
import { deleteCategory } from '@/src/api/categories/categories.api';
import { deleteFactor, deleteMetric } from '@/src/api/criteria/criteria.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { Modal } from './Modal';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    entityName: string;
    onClose: () => void;
    pickedItem: TableRecord | null;
    activeTab: Tab;
    setData?: Dispatch<SetStateAction<TableRecord[]>>;
}

export function DeleteConfirmModal({
    isOpen,
    entityName,
    onClose,
    pickedItem,
    activeTab,
    setData,
}: DeleteConfirmModalProps) {
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

            if (setData) {
                setData((prev) =>
                    prev.filter((item) => {
                        const isSameId =
                            String(item.id) === String(pickedItem.id);

                        if (activeTab === 'criteria') {
                            return !(isSameId && item.type === pickedItem.type);
                        }

                        return !isSameId;
                    }),
                );
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${entityName}`}>
            <p className="text-zinc-400 mb-6 text-sm whitespace-normal">
                Are you sure you want to delete this {entityName}? This action
                cannot be undone.
            </p>
            <div className="flex justify-end gap-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                    Confirm Delete
                </button>
            </div>
        </Modal>
    );
}
