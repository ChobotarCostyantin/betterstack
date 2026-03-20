'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { TableRecord } from '../types';
import { updateAuthorDetails } from '@/src/api/reviews/reviews.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { UpdateAuthorDetailsInput } from '@/src/api/reviews/reviews.schemas';

interface AuthorDetailsFormModalProps {
    isOpen: boolean;
    item: TableRecord | null;
    onClose: () => void;
    onSuccess: (item: TableRecord) => void;
}

export function AuthorDetailsFormModal({
    isOpen,
    item,
    onClose,
    onSuccess,
}: AuthorDetailsFormModalProps) {
    const [formData, setFormData] = useState<UpdateAuthorDetailsInput>({
        fullName: '',
        bio: '',
        avatarUrl: '',
        websiteUrl: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (item) {
            setFormData({
                fullName: String(item.fullName || ''),
                bio: String(item.bio || ''),
                avatarUrl: item.avatarUrl ? String(item.avatarUrl) : null,
                websiteUrl: item.websiteUrl ? String(item.websiteUrl) : null,
            });
            setError(null);
        }
    }, [isOpen, item]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value || null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !item.id) return;
        setError(null);

        if (!formData.fullName.trim()) return setError('Full Name is required');

        setIsLoading(true);

        try {
            await updateAuthorDetails(browserClient, Number(item.id), formData);

            onSuccess({ ...item, ...formData });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to save author details',
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white">
                        Edit Author Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Avatar URL
                            </label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl || ''}
                                onChange={handleInputChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Website URL
                            </label>
                            <input
                                type="text"
                                name="websiteUrl"
                                value={formData.websiteUrl || ''}
                                onChange={handleInputChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
