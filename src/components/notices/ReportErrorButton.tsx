'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

const FIELDS = [
    ['', 'Something else'],
    ['title', 'Title'],
    ['application_deadline_ad', 'Application deadline'],
    ['exam_date_ad', 'Exam date'],
    ['posts', 'Posts / seats'],
    ['summary_en', 'Summary'],
] as const;

export default function ReportErrorButton({ slug }: { slug: string }) {
    const [open, setOpen] = useState(false);
    const [field, setField] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

    if (!open) {
        return (
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-gray-600 underline-offset-2 hover:text-red-700 hover:underline">
                <Flag className="h-4 w-4" aria-hidden="true" /> Report an error
            </button>
        );
    }

    if (state === 'done') {
        return <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800" role="status">Thanks - our team will check this notice against the official source.</p>;
    }

    return (
        <form
            className="space-y-2 rounded-xl border border-gray-200 bg-white p-4"
            onSubmit={async (e) => {
                e.preventDefault();
                setState('sending');
                try {
                    const res = await fetch(`${API_URL}/free/notices/${encodeURIComponent(slug)}/report`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                        body: JSON.stringify({ field: field || null, message, email: email || null }),
                    });
                    setState(res.ok ? 'done' : 'error');
                } catch {
                    setState('error');
                }
            }}
        >
            <p className="text-sm font-semibold text-gray-900">What is wrong on this page?</p>
            <select value={field} onChange={(e) => setField(e.target.value)} className="h-9 w-full rounded-lg border border-gray-300 px-2 text-sm" aria-label="Which field">
                {FIELDS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <textarea
                required
                minLength={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. The official notice says the deadline is Asoj 25"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                aria-label="Describe the error"
            />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="h-9 w-full rounded-lg border border-gray-300 px-2 text-sm" aria-label="Your email (optional)" />
            <div className="flex gap-2">
                <button type="submit" disabled={state === 'sending'} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60">
                    {state === 'sending' ? 'Sending…' : 'Send report'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                    Cancel
                </button>
            </div>
            {state === 'error' && <p className="text-sm text-red-600" role="alert">Could not send - please try again.</p>}
        </form>
    );
}
