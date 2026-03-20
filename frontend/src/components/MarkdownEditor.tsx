'use client';

import React, { useState } from 'react';
import Markdown from './Markdown';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = 'Write markdown here...',
    minHeight = '300px',
}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

    return (
        <div className="flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900 h-full">
            <div className="flex border-b border-zinc-800 bg-[#111114] shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'code'
                            ? 'text-white border-b-2 border-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                    Code
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'preview'
                            ? 'text-white border-b-2 border-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                    Preview
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'code' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full p-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none"
                        placeholder={placeholder}
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full p-4 overflow-y-auto prose prose-sm prose-invert prose-zinc max-w-none bg-[#09090b]">
                        {value ? (
                            <Markdown content={value} />
                        ) : (
                            <span className="text-zinc-600 italic">
                                Preview will appear here...
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
