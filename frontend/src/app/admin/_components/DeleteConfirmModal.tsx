import React from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    entityName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmModal({
    isOpen,
    entityName,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                <h3 className="text-lg font-bold text-white mb-2 capitalize">
                    Delete {entityName}
                </h3>
                <p className="text-zinc-400 mb-6 text-sm whitespace-normal">
                    Are you sure you want to delete this {entityName}? This
                    action cannot be undone.
                </p>
                <div className="flex justify-end gap-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
