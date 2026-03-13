'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TableRecord } from '../types';
import {
    createFactor,
    updateFactor,
    createMetric,
    updateMetric,
} from '@/src/api/criteria/criteria.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type {
    CreateFactorInput,
    UpdateFactorInput,
    CreateMetricInput,
    UpdateMetricInput,
} from '@/src/api/criteria/criteria.schemas';

interface CriteriaFormModalProps {
    isOpen: boolean;
    isEditing?: boolean;
    criteriaType: 'Factor' | 'Metric';
    item?: TableRecord | null;
    onClose: () => void;
    onSuccess: (item: TableRecord) => void;
}

export function CriteriaFormModal({
    isOpen,
    isEditing = false,
    criteriaType,
    item,
    onClose,
    onSuccess,
}: CriteriaFormModalProps) {
    const isFactorModal = criteriaType === 'Factor';

    const [formData, setFormData] = useState<{
        positiveVariant: string;
        negativeVariant: string;
        name: string;
        higherIsBetter: boolean;
    }>({
        positiveVariant: '',
        negativeVariant: '',
        name: '',
        higherIsBetter: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update form data when item changes
    useEffect(() => {
        if (isEditing && item) {
            if (isFactorModal) {
                setFormData({
                    positiveVariant: String(item.positiveVariant || ''),
                    negativeVariant: String(item.negativeVariant || ''),
                    name: '',
                    higherIsBetter: false,
                });
            } else {
                setFormData({
                    positiveVariant: '',
                    negativeVariant: '',
                    name: String(item.name || ''),
                    higherIsBetter: Boolean(item.higherIsBetter || false),
                });
            }
        } else {
            setFormData({
                positiveVariant: '',
                negativeVariant: '',
                name: '',
                higherIsBetter: false,
            });
        }
        setError(null);
    }, [isOpen, item, isEditing, isFactorModal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate required fields
        if (isFactorModal) {
            if (!formData.positiveVariant.trim()) {
                setError('Positive variant is required');
                return;
            }
            if (!formData.negativeVariant.trim()) {
                setError('Negative variant is required');
                return;
            }
        } else {
            if (!formData.name.trim()) {
                setError('Metric name is required');
                return;
            }
        }

        setIsLoading(true);

        try {
            if (isFactorModal) {
                if (isEditing && item?.id) {
                    const input: UpdateFactorInput = {
                        ...(formData.positiveVariant && {
                            positiveVariant: formData.positiveVariant,
                        }),
                        ...(formData.negativeVariant && {
                            negativeVariant: formData.negativeVariant,
                        }),
                    };
                    const result = await updateFactor(
                        browserClient,
                        Number(item.id),
                        input,
                    );
                    onSuccess({
                        ...result,
                        type: 'Factor',
                    } as unknown as TableRecord);
                } else {
                    const input: CreateFactorInput = {
                        positiveVariant: formData.positiveVariant,
                        negativeVariant: formData.negativeVariant,
                    };
                    const result = await createFactor(browserClient, input);
                    onSuccess({
                        ...result,
                        type: 'Factor',
                    } as unknown as TableRecord);
                }
            } else {
                if (isEditing && item?.id) {
                    const input: UpdateMetricInput = {
                        ...(formData.name && { name: formData.name }),
                        higherIsBetter: formData.higherIsBetter,
                    };
                    const result = await updateMetric(
                        browserClient,
                        Number(item.id),
                        input,
                    );
                    onSuccess({
                        ...result,
                        type: 'Metric',
                    } as unknown as TableRecord);
                } else {
                    const input: CreateMetricInput = {
                        name: formData.name,
                        higherIsBetter: formData.higherIsBetter,
                    };
                    const result = await createMetric(browserClient, input);
                    onSuccess({
                        ...result,
                        type: 'Metric',
                    } as unknown as TableRecord);
                }
            }
        } catch (err) {
            let errorMessage = `Failed to save ${criteriaType.toLowerCase()}`;

            if (err instanceof Error) {
                if (
                    err.message.includes('409') ||
                    err.message.includes('duplicate') ||
                    err.message.includes('unique')
                ) {
                    if (isFactorModal) {
                        errorMessage =
                            'A factor with these variants already exists';
                    } else {
                        errorMessage = 'A metric with this name already exists';
                    }
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
                        {isEditing
                            ? `Edit ${criteriaType}`
                            : `Add ${criteriaType}`}
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

                    {isFactorModal ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Positive Variant *
                                </label>
                                <input
                                    type="text"
                                    name="positiveVariant"
                                    value={formData.positiveVariant}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                    placeholder="e.g., Open source"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Negative Variant *
                                </label>
                                <input
                                    type="text"
                                    name="negativeVariant"
                                    value={formData.negativeVariant}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                    placeholder="e.g., Proprietary"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
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
                                    placeholder="e.g., Startup time (ms)"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="higherIsBetter"
                                    name="higherIsBetter"
                                    checked={formData.higherIsBetter}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-zinc-100 cursor-pointer"
                                />
                                <label
                                    htmlFor="higherIsBetter"
                                    className="text-sm font-medium text-zinc-300 cursor-pointer"
                                >
                                    Higher is better
                                </label>
                            </div>
                        </>
                    )}

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
