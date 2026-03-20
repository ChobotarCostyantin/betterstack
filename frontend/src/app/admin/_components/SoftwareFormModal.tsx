'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, Loader2 } from 'lucide-react';
import type { TableRecord } from '../types';
import {
    createSoftware,
    updateSoftware,
    getSoftwareBySlug,
} from '@/src/api/software/software.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { listCategories } from '@/src/api/categories/categories.api';
import type { CategoryListItem } from '@/src/api/categories/categories.schemas';
import type {
    CreateSoftwareInput,
    UpdateSoftwareInput,
} from '@/src/api/software/software.schemas';

interface SoftwareFormModalProps {
    isOpen: boolean;
    isEditing?: boolean;
    item?: TableRecord | null;
    onClose: () => void;
    onSuccess: (item: TableRecord) => void;
}

export function SoftwareFormModal({
    isOpen,
    isEditing = false,
    item,
    onClose,
    onSuccess,
}: SoftwareFormModalProps) {
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        developer: '',
        shortDescription: '',
        websiteUrl: '',
        gitRepoUrl: '',
        logoUrl: '',
        screenshotUrls: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        [],
    );

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (isEditing && item?.slug) {
            setIsFetchingDetails(true);
            setError(null);

            getSoftwareBySlug(browserClient, String(item.slug))
                .then((detail) => {
                    setFormData({
                        slug: detail.slug || '',
                        name: detail.name || '',
                        developer: detail.developer || '',
                        shortDescription: detail.shortDescription || '',
                        websiteUrl: detail.websiteUrl || '',
                        gitRepoUrl: detail.gitRepoUrl || '',
                        logoUrl: detail.logoUrl || '',
                        screenshotUrls: Array.isArray(detail.screenshotUrls)
                            ? detail.screenshotUrls.join('\n')
                            : '',
                    });

                    if (detail.categories) {
                        setSelectedCategoryIds(
                            detail.categories.map((c) => c.id),
                        );
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch software details:', err);
                    setError('Failed to load software details');
                })
                .finally(() => {
                    setIsFetchingDetails(false);
                });
        } else {
            setFormData({
                slug: '',
                name: '',
                developer: '',
                shortDescription: '',
                websiteUrl: '',
                gitRepoUrl: '',
                logoUrl: '',
                screenshotUrls: '',
            });
            setSelectedCategoryIds([]);
            setError(null);
        }
    }, [isOpen, item, isEditing]);

    useEffect(() => {
        if (isOpen) {
            listCategories(browserClient, { perPage: 100 })
                .then((res) => {
                    setCategories(res.data || []);
                })
                .catch((err) =>
                    console.error('Failed to fetch categories:', err),
                );
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleCategory = (categoryId: number) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.slug.trim()) return setError('Slug is required');
        if (!formData.name.trim()) return setError('Name is required');
        if (!formData.shortDescription.trim())
            return setError('Short description is required');
        if (!formData.developer.trim())
            return setError('Developer is required');

        setIsLoading(true);

        try {
            const screenshotUrls = formData.screenshotUrls
                .split('\n')
                .map((url) => url.trim())
                .filter((url) => url.length > 0);

            const baseInput = {
                ...(formData.slug && { slug: formData.slug }),
                ...(formData.name && { name: formData.name }),
                ...(formData.developer && { developer: formData.developer }),
                ...(formData.shortDescription && {
                    shortDescription: formData.shortDescription,
                }),
                ...(formData.websiteUrl && { websiteUrl: formData.websiteUrl }),
                ...(formData.gitRepoUrl && { gitRepoUrl: formData.gitRepoUrl }),
                ...(formData.logoUrl && { logoUrl: formData.logoUrl }),
                ...(screenshotUrls.length > 0 && { screenshotUrls }),
                ...(selectedCategoryIds.length > 0 && {
                    categoryIds: selectedCategoryIds,
                }),
            };

            if (isEditing && item?.id) {
                // 1. Update the software
                await updateSoftware(
                    browserClient,
                    Number(item.id),
                    baseInput as UpdateSoftwareInput,
                );

                // 2. Fetch the updated item to pass back to the table
                const updatedItem = await getSoftwareBySlug(
                    browserClient,
                    formData.slug,
                );
                onSuccess(updatedItem as unknown as TableRecord);
            } else {
                // createSoftware already returns the created item
                const result = await createSoftware(
                    browserClient,
                    baseInput as CreateSoftwareInput,
                );
                onSuccess(result as unknown as TableRecord);
            }
        } catch (err) {
            let errorMessage = 'Failed to save software';

            if (err instanceof Error) {
                if (
                    err.message.includes('409') ||
                    err.message.includes('duplicate') ||
                    err.message.includes('unique')
                ) {
                    errorMessage =
                        'A software with this slug or name already exists';
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

    const selectedCategoryNames = categories
        .filter((c) => selectedCategoryIds.includes(c.id))
        .map((c) => c.name)
        .join(', ');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#111114]">
                    <h3 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Software' : 'Add Software'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {isFetchingDetails ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                            <span className="mt-4 text-sm text-zinc-400">
                                Loading software details...
                            </span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="e.g. JetBrains Rider"
                                        required
                                    />
                                </div>

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
                                        placeholder="e.g. jetbrains-rider"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Developer *
                                    </label>
                                    <input
                                        type="text"
                                        name="developer"
                                        value={formData.developer}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                        placeholder="e.g. JetBrains"
                                        required
                                    />
                                </div>

                                <div ref={dropdownRef} className="relative">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Categories
                                    </label>
                                    <div
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white cursor-pointer flex justify-between items-center hover:border-zinc-600 transition-colors"
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                    >
                                        <span className="truncate text-sm">
                                            {selectedCategoryIds.length > 0 ? (
                                                selectedCategoryNames
                                            ) : (
                                                <span className="text-zinc-500">
                                                    Select categories...
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-zinc-500 transition-transform ${
                                                isDropdownOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full right-0 left-0 mt-2 bg-[#111114] border border-zinc-800 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                                            {categories.length === 0 ? (
                                                <div className="p-3 text-sm text-zinc-500 text-center">
                                                    No categories available
                                                </div>
                                            ) : (
                                                categories.map((category) => {
                                                    const isSelected =
                                                        selectedCategoryIds.includes(
                                                            category.id,
                                                        );
                                                    return (
                                                        <div
                                                            key={category.id}
                                                            className="flex items-center gap-3 p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                                                            onClick={() =>
                                                                toggleCategory(
                                                                    category.id,
                                                                )
                                                            }
                                                        >
                                                            <div
                                                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                                    isSelected
                                                                        ? 'bg-white border-white text-black'
                                                                        : 'border-zinc-600 bg-[#09090b]'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <Check
                                                                        size={
                                                                            12
                                                                        }
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-zinc-200">
                                                                {category.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                    placeholder="Fast & powerful cross-platform IDE"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Website URL
                                    </label>
                                    <input
                                        type="text"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Git Repo URL
                                    </label>
                                    <input
                                        type="text"
                                        name="gitRepoUrl"
                                        value={formData.gitRepoUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Logo URL
                                    </label>
                                    <input
                                        type="text"
                                        name="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Screenshot URLs (one per line)
                                </label>
                                <textarea
                                    name="screenshotUrls"
                                    value={formData.screenshotUrls}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
                                    placeholder="https://example.com/screen1.png&#10;https://example.com/screen2.png"
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
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading
                                        ? 'Saving...'
                                        : isEditing
                                          ? 'Update Software'
                                          : 'Add Software'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
