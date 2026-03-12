import React, { Dispatch, SetStateAction } from 'react';
import type { TableRecord } from '../types';
import { makeAdmin } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';

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
    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                <h3 className="text-lg font-bold text-zinc-100 mb-2 capitalize">
                    Make User Admin
                </h3>
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
            </div>
        </div>
    );
}
