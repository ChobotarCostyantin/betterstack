'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MarkdownEditor } from '@/src/components/MarkdownEditor';
import {
    createSoftwareReview,
    updateSoftwareReview,
    getSoftwareReviewBySlug,
} from '@/src/api/reviews/reviews.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { SoftwareReviewResponse } from '@/src/api/reviews/reviews.schemas';

interface SoftwareReviewEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    softwareSlug: string;
    existingReview: SoftwareReviewResponse | null;
    onSuccess: (review: SoftwareReviewResponse) => void;
}

export function SoftwareReviewEditModal({
    isOpen,
    onClose,
    softwareSlug,
    existingReview,
    onSuccess,
}: SoftwareReviewEditModalProps) {
    const [content, setContent] = useState(existingReview?.content || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (existingReview) {
                await updateSoftwareReview(browserClient, existingReview.id, {
                    content,
                });
            } else {
                await createSoftwareReview(browserClient, {
                    softwareSlug,
                    content,
                });
            }

            const updatedReview = await getSoftwareReviewBySlug(
                browserClient,
                softwareSlug,
            );
            onSuccess(updatedReview);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to save review',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:px-4 sm:py-6">
            <div className="bg-[#111114] sm:border border-zinc-800 sm:rounded-xl shadow-2xl w-full h-full sm:max-w-5xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-[#111114] shrink-0">
                    <h3 className="text-lg font-bold text-white">
                        {existingReview ? 'Edit Review' : 'Add Review'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col h-full space-y-4"
                    >
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm shrink-0">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col flex-1 min-h-0">
                            <label className="block text-sm font-medium text-zinc-300 mb-2 shrink-0">
                                Review Content
                            </label>
                            <div className="flex-1 overflow-hidden">
                                <MarkdownEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write your review here..."
                                    minHeight="100%"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 shrink-0">
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
                                disabled={isLoading || !content.trim()}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
