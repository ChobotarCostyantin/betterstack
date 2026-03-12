import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm px-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl transform transition-all">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-zinc-100 capitalize">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-100"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
