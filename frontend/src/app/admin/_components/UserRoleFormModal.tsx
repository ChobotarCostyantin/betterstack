'use client';

import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TableRecord } from '../types';
import { updateUserRole } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { type Role } from '@/src/api/auth/auth.schemas';

interface UserRoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    pickedItem: TableRecord | null;
    setData?: Dispatch<SetStateAction<TableRecord[]>>;
}

export function UserRoleFormModal({
    isOpen,
    onClose,
    pickedItem,
    setData,
}: UserRoleFormModalProps) {
    const [role, setRole] = useState<Role>('user');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && pickedItem) {
            setRole((pickedItem.role as Role) || 'user');
        }
        setError(null);
    }, [isOpen, pickedItem]);

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pickedItem || !pickedItem.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const id = Number(pickedItem.id);
            await updateUserRole(browserClient, id, role);

            if (setData) {
                setData((prev) =>
                    prev.map((item) => {
                        if (String(item.id) === String(pickedItem.id)) {
                            return { ...item, role };
                        }
                        return item;
                    }),
                );
            }
            onClose();
        } catch (err) {
            let errorMessage = 'Failed to update user role';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl shadow-2xl max-w-sm w-full">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white">
                        Edit User Role
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleUpdateRole} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <p className="text-zinc-400 text-sm">
                        Updating role for user{' '}
                        <strong className="text-white">
                            {String(pickedItem?.email || '')}
                        </strong>
                        .
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Role *
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                            required
                        >
                            <option value="user">User</option>
                            <option value="author">Author</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
