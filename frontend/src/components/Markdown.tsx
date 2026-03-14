import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github-dark.css';
import { CopyButton } from '../app/article/[slug]/_components/CopyButton';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, {
    defaultSchema,
    type Options as SanitizeOptions,
} from 'rehype-sanitize';

const ALLOWED_CLASSES = [
    // === Text Alignment ===
    'text-left',
    'text-center',
    'text-right',
    'text-justify',

    // === Block Centering & Flexbox (Positioning) ===
    'mx-auto',
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    'justify-between',

    // === Font Size ===
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',

    // === Font Weight ===
    'font-light',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-extrabold',

    // === Style & Decoration ===
    'italic',
    'not-italic',
    'underline',
    'line-through',
    'no-underline',
    'uppercase',
    'lowercase',
    'capitalize',

    // === Letter Spacing & Line Height ===
    'tracking-tight',
    'tracking-wide',
    'leading-none',
    'leading-tight',
    'leading-normal',
    'leading-relaxed',
    'leading-loose',

    // === Text Colors ===
    'text-red-500',
    'text-red-400',
    'text-emerald-500',
    'text-emerald-400',
    'text-blue-500',
    'text-blue-400',
    'text-yellow-500',
    'text-yellow-400',
    'text-zinc-300',
    'text-zinc-400',
    'text-white',
    'text-black',

    // === Background Colors ===
    'bg-transparent',
    'bg-white',
    'bg-black',
    'bg-zinc-800',
    'bg-zinc-900',
    'bg-red-500',
    'bg-red-900',
    'bg-emerald-500',
    'bg-emerald-900',
    'bg-blue-500',
    'bg-blue-900',
    'bg-yellow-500',
    'bg-yellow-900',

    // === Borders (Width & Edges) ===
    'border',
    'border-2',
    'border-4',
    'border-t',
    'border-b',
    'border-l',
    'border-r',
    'border-l-2',
    'border-l-4',
    // === Border Colors ===
    'border-transparent',
    'border-white',
    'border-zinc-700',
    'border-zinc-800',
    'border-red-500',
    'border-emerald-500',
    'border-blue-500',
    'border-yellow-500',

    // === Border Radius ===
    'rounded-none',
    'rounded-sm',
    'rounded', // Default rounding
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-full', // Perfect circles (for avatars or badges)

    // === Padding ===
    'p-2',
    'p-4',
    'p-6',
    'p-8',
    'px-2',
    'px-4',
    'px-6',
    'px-8', // Horizontal padding
    'py-2',
    'py-4',
    'py-6',
    'py-8', // Vertical padding
    'pt-2',
    'pt-4',
    'pb-2',
    'pb-4',
    'pl-2',
    'pl-4',
    'pr-2',
    'pr-4',

    // === Margin ===
    'm-2',
    'm-4',
    'm-6',
    'm-8',
    'mx-2',
    'mx-4',
    'mx-6',
    'mx-8', // Horizontal margin
    'my-2',
    'my-4',
    'my-6',
    'my-8', // Vertical margin
    'mt-2',
    'mt-4',
    'mt-6',
    'mt-8', // Top margin
    'mb-2',
    'mb-4',
    'mb-6',
    'mb-8', // Bottom margin
    'ml-2',
    'ml-4',
    'mr-2',
    'mr-4',
];

const sanitizeOptions: SanitizeOptions = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        '*': [
            ...(defaultSchema.attributes?.['*'] || []),
            ['className', ...ALLOWED_CLASSES],
        ],
    },
};

interface MarkdownProps {
    content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractTextFromNode = (node: any): string => {
    if (!node) return '';
    if (node.type === 'text') return String(node.value || '');
    if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractTextFromNode).join('');
    }
    return '';
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [
    rehypeRaw,
    [rehypeSanitize, sanitizeOptions] as [
        typeof rehypeSanitize,
        SanitizeOptions,
    ],
    rehypeHighlight,
];

const markdownComponents: Components = {
    h1: (props) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />
    ),
    h2: (props) => (
        <h2
            className="text-2xl font-bold mt-8 mb-4 text-white border-b border-zinc-800 pb-2"
            {...props}
        />
    ),
    h3: (props) => (
        <h3
            className="text-xl font-semibold mt-6 mb-3 text-zinc-100"
            {...props}
        />
    ),
    h4: (props) => (
        <h4
            className="text-lg font-medium mt-6 mb-2 text-zinc-200"
            {...props}
        />
    ),
    p: (props) => (
        <p className="text-zinc-300 leading-relaxed mb-4" {...props} />
    ),
    a: (props) => (
        <a
            className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-500/30"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    strong: (props) => (
        <strong className="font-semibold text-zinc-100" {...props} />
    ),
    ul: (props) => (
        <ul
            className="list-disc list-outside text-zinc-300 mb-4 space-y-2 ml-5"
            {...props}
        />
    ),
    ol: (props) => (
        <ol
            className="list-decimal list-outside text-zinc-300 mb-4 space-y-2 ml-5"
            {...props}
        />
    ),
    li: (props) => <li className="pl-1" {...props} />,
    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-zinc-600 bg-zinc-900/50 py-3 px-5 rounded-r-xl italic text-zinc-400 my-6"
            {...props}
        />
    ),
    table: (props) => (
        <div className="overflow-x-auto mb-6 my-6 rounded-xl border border-zinc-800">
            <table className="w-full text-left border-collapse" {...props} />
        </div>
    ),
    th: (props) => (
        <th
            className="border-b border-zinc-700 px-4 py-3 font-semibold text-zinc-200 bg-zinc-900/80"
            {...props}
        />
    ),
    td: (props) => (
        <td
            className="border-b border-zinc-800 px-4 py-3 text-zinc-300 bg-zinc-900/30"
            {...props}
        />
    ),
    pre: ({ node, className, children, ...props }) => {
        const rawText = extractTextFromNode(node).trimEnd();

        return (
            <div className="relative group my-6">
                <CopyButton text={rawText} />
                <pre
                    className={`${className || ''} overflow-x-auto p-4 rounded-xl bg-[#0d1117] border border-zinc-800 text-sm scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent`}
                    {...props}
                >
                    {children}
                </pre>
            </div>
        );
    },
    code: ({ className, children, ...props }) => {
        const isInline = !className;
        return (
            <code
                className={`${className || ''} ${
                    isInline
                        ? 'bg-zinc-800/80 text-emerald-200 px-1.5 py-0.5 rounded-md text-sm font-mono border border-zinc-700/50'
                        : 'font-mono text-sm'
                }`}
                {...props}
            >
                {children}
            </code>
        );
    },
};

export default function Markdown({ content }: MarkdownProps) {
    return (
        <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
        >
            {content}
        </ReactMarkdown>
    );
}
