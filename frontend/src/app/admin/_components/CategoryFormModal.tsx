'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TableRecord } from '../types';
import {
    createCategory,
    renameCategory,
} from '@/src/api/categories/categories.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type {
    CreateCategoryInput,
    RenameCategoryInput,
} from '@/src/api/categories/categories.schemas';

interface CategoryFormModalProps {
    isOpen: boolean;
    isEditing?: boolean;
    item?: TableRecord | null;
    onClose: () => void;
    onSuccess: (item: TableRecord) => void;
}

export function CategoryFormModal({
    isOpen,
    isEditing = false,
    item,
    onClose,
    onSuccess,
}: CategoryFormModalProps) {
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update form data when item changes
    useEffect(() => {
        if (isEditing && item) {
            setFormData({
                slug: String(item.slug || ''),
                name: String(item.name || ''),
            });
        } else {
            setFormData({
                slug: '',
                name: '',
            });
        }
        setError(null);
    }, [isOpen, item, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate required fields
        if (!formData.slug.trim()) {
            setError('Slug is required');
            return;
        }
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        setIsLoading(true);

        try {
            if (isEditing && item?.id) {
                const input: RenameCategoryInput = {
                    ...(formData.slug && { slug: formData.slug }),
                    ...(formData.name && { name: formData.name }),
                };
                const result = await renameCategory(
                    browserClient,
                    Number(item.id),
                    input,
                );
                onSuccess(result as unknown as TableRecord);
            } else {
                const input: CreateCategoryInput = {
                    slug: formData.slug,
                    name: formData.name,
                };
                const result = await createCategory(browserClient, input);
                onSuccess(result as unknown as TableRecord);
            }
        } catch (err) {
            let errorMessage = 'Failed to save category';

            if (err instanceof Error) {
                if (
                    err.message.includes('409') ||
                    err.message.includes('duplicate') ||
                    err.message.includes('unique')
                ) {
                    errorMessage =
                        'A category with this slug or name already exists';
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Category' : 'Add Category'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                            placeholder="e.g., ides"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                            placeholder="e.g., IDEs & Code Editors"
                            required
                        />
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
