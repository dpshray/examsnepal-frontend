'use client';

import { useState } from 'react';
import { BellRing } from 'lucide-react';
import type { NoticeCategory } from '@/lib/noticeApi';
import { NOTICE_CATEGORIES } from '@/lib/noticeFormat';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export default function NoticeAlertsForm({ defaultCategory }: { defaultCategory?: NoticeCategory }) {
    const [email, setEmail] = useState('');
    const [categories, setCategories] = useState<NoticeCategory[]>(defaultCategory ? [defaultCategory] : []);
    const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const toggle = (c: NoticeCategory) => setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

    return (
        <section aria-labelledby="notice-alerts-heading" className="rounded-xl border border-green-200 bg-green-50/60 p-5">
            <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-green-700" aria-hidden="true" />
                <h2 id="notice-alerts-heading" className="text-base font-bold text-gray-900">Get notice alerts</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">One daily email with new official notices - no spam, unsubscribe anytime.</p>
            {state === 'done' ? (
                <p className="mt-3 rounded-lg bg-white p-3 text-sm font-medium text-green-800" role="status">{message}</p>
            ) : (
                <form
                    className="mt-3 space-y-3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setState('sending');
                        try {
                            const res = await fetch(`${API_URL}/free/notices/subscribe`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                body: JSON.stringify({ email, categories }),
                            });
                            const json = await res.json().catch(() => ({}));
                            setMessage(json?.message || (res.ok ? 'Subscribed.' : 'Could not subscribe - please try again.'));
                            setState(res.ok ? 'done' : 'error');
                        } catch {
                            setMessage('Could not subscribe - please try again.');
                            setState('error');
                        }
                    }}
                >
                    <fieldset className="flex flex-wrap gap-2">
                        <legend className="sr-only">Categories</legend>
                        {NOTICE_CATEGORIES.map((c) => (
                            <label
                                key={c.slug}
                                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm ring-1 transition ${
                                    categories.includes(c.slug) ? 'bg-green-600 text-white ring-green-600' : 'bg-white text-gray-700 ring-gray-300 hover:ring-green-400'
                                }`}
                            >
                                <input type="checkbox" className="sr-only" checked={categories.includes(c.slug)} onChange={() => toggle(c.slug)} />
                                {c.label}
                            </label>
                        ))}
                    </fieldset>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="flex-1">
                            <span className="sr-only">Email address</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={state === 'sending'}
                            className="h-10 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            {state === 'sending' ? 'Subscribing…' : 'Get alerts'}
                        </button>
                    </div>
                    {state === 'error' && <p className="text-sm text-red-600" role="alert">{message}</p>}
                </form>
            )}
        </section>
    );
}
