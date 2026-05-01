'use client';

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { SoftwareReviewResponse } from '@/src/api/reviews/reviews.schemas';
import dynamic from 'next/dynamic';

const Markdown = dynamic(() => import('@/src/components/Markdown'), {
    ssr: true,
});

const SoftwareReviewEditModal = dynamic(
    () =>
        import('./SoftwareReviewEditModal').then(
            (mod) => mod.SoftwareReviewEditModal,
        ),
    { ssr: false },
);

interface SoftwareReviewSectionProps {
    softwareSlug: string;
    review: SoftwareReviewResponse | null;
    canEdit: boolean;
}

export default function SoftwareReviewSection({
    softwareSlug,
    review,
    canEdit,
}: SoftwareReviewSectionProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentReview, setCurrentReview] =
        useState<SoftwareReviewResponse | null>(review);

    return (
        <div className="relative group">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Review</h2>
                {canEdit && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-lg transition-all"
                        title={currentReview ? 'Edit Review' : 'Add Review'}
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            {currentReview?.content ? (
                <div className="max-w-none prose prose-sm sm:prose-base prose-zinc prose-invert">
                    <Markdown content={currentReview.content} />
                    <div className="mt-4 text-sm text-zinc-500 italic">
                        Reviewed by {currentReview.author.fullName}
                    </div>
                </div>
            ) : (
                <div className="text-zinc-500 py-4">
                    No review available yet.
                </div>
            )}

            {isEditModalOpen && (
                <SoftwareReviewEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    softwareSlug={softwareSlug}
                    existingReview={currentReview}
                    onSuccess={(updatedReview: SoftwareReviewResponse) =>
                        setCurrentReview(updatedReview)
                    }
                />
            )}
        </div>
    );
}
