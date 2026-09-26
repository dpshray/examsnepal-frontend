"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import marketingService, { type LifecycleBanner as Banner } from "@/services/MarketingService";

const DISMISS_DAYS = 3;
const TONES: Record<Banner["tone"], string> = {
  info: "border-blue-200 bg-blue-50 text-blue-950",
  promo: "border-green-200 bg-green-50 text-green-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
};

const storageKey = (key: string) => `lifecycle-banner-dismissed:${key}`;

function isDismissed(key: string) {
  try {
    const until = Number(localStorage.getItem(storageKey(key)) ?? 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

/** Dashboard nudge picked by the backend from the student's lifecycle stage. */
export default function LifecycleBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    let cancelled = false;
    marketingService
      .getBanner()
      .then((b) => { if (!cancelled && b && !isDismissed(b.key)) setBanner(b); })
      .catch(() => { /* a banner is optional; never break the dashboard */ });
    return () => { cancelled = true; };
  }, []);

  if (!banner) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey(banner.key), String(Date.now() + DISMISS_DAYS * 86_400_000));
    } catch { /* storage may be unavailable */ }
    setBanner(null);
  };

  return (
    <div role="region" aria-label={banner.title} className={`relative flex flex-col gap-3 rounded-xl border p-4 pr-10 sm:flex-row sm:items-center sm:pr-4 ${TONES[banner.tone]}`}>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{banner.title}</p>
        <p className="text-sm opacity-80">{banner.body}</p>
      </div>
      <Link
        href={`${banner.cta_path}?utm_source=app&utm_medium=banner&utm_campaign=${banner.key}`}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        {banner.cta_label} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <button type="button" onClick={dismiss} className="absolute right-2 top-2 rounded p-1 opacity-60 hover:opacity-100 sm:static" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
