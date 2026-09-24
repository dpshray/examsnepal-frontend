'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
    const [copied, setCopied] = useState(false);
    const text = encodeURIComponent(`${title} ${url}`);
    const links = [
        { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, className: 'bg-[#1877F2] hover:bg-[#166FE0]' },
        { label: 'WhatsApp', href: `https://wa.me/?text=${text}`, className: 'bg-[#1FAF55] hover:bg-[#1C9E4D]' },
        { label: 'Viber', href: `viber://forward?text=${text}`, className: 'bg-[#7360F2] hover:bg-[#6552E0]' },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2" aria-label="Share this notice">
            {links.map((l) => (
                <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${l.className}`}
                >
                    {l.label}
                </a>
            ))}
            <button
                type="button"
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    } catch {
                        /* clipboard unavailable */
                    }
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy link'}
            </button>
        </div>
    );
}
