import React, { Dispatch, SetStateAction } from 'react';
import type { TableRecord } from '../types';
import { makeAdmin } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { Modal } from './Modal';

interface MakeUserAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    pickedItem: TableRecord | null;
    setData?: Dispatch<SetStateAction<TableRecord[]>>;
}

export function MakeUserAdminModal({
    isOpen,
    onClose,
    pickedItem,
    setData,
}: MakeUserAdminModalProps) {
    const handleMakeUserAdmin = async () => {
        if (!pickedItem || !pickedItem.id) return;

        try {
            const id = Number(pickedItem.id);
            await makeAdmin(browserClient, id);

            if (setData) {
                setData((prev) =>
                    prev.map((item) => {
                        if (String(item.id) === String(pickedItem.id)) {
                            return { ...item, role: 'admin' };
                        }
                        return item;
                    }),
                );
            }
        } catch (error) {
            console.error('Failed to make user admin:', error);
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Make User Admin">
            <p className="text-zinc-400 mb-6 text-sm whitespace-normal">
                Are you sure you want to make this user admin? This action
                cannot be undone.
            </p>
            <div className="flex justify-end gap-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleMakeUserAdmin}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-zinc-100 transition-colors"
                >
                    Make Admin
                </button>
            </div>
        </Modal>
    );
}
