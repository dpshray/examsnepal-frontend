"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import marketingService, { type OnboardingStatus } from "@/services/MarketingService";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** The next 24 months, starting with the current one. */
function upcomingMonths() {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` };
  });
}

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [examTypeId, setExamTypeId] = useState<number | null>(null);
  const [month, setMonth] = useState<string>("");
  const [notSure, setNotSure] = useState(false);
  const [saving, setSaving] = useState(false);
  const months = useMemo(upcomingMonths, []);

  useEffect(() => {
    marketingService.getOnboarding()
      .then((s) => {
        if (!s?.needs_onboarding) { router.replace("/student/dashboard"); return; }
        setStatus(s);
        setExamTypeId(s.exam_type_id);
        if (s.exam_locked) setStep(2); // exam is tied to their plan
      })
      .catch(() => router.replace("/student/dashboard"));
  }, [router]);

  const save = async (payload: Parameters<typeof marketingService.saveOnboarding>[0]) => {
    setSaving(true);
    try {
      const res = await marketingService.saveOnboarding(payload);
      router.push(res?.next_path || "/student/dashboard");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Could not save. Please try again.");
      setSaving(false);
    }
  };

  if (!status) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-green-700" /></div>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <p className="mb-2 text-sm font-medium text-green-700">Step {step} of 2</p>
      <div className="mb-6 flex gap-1.5" aria-hidden>
        {[1, 2].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-green-600" : "bg-gray-200"}`} />)}
      </div>

      {step === 1 ? (
        <section aria-labelledby="exam-q">
          <h1 id="exam-q" className="text-2xl font-bold text-gray-900">Which exam are you preparing for?</h1>
          <p className="mt-1 text-gray-600">We&apos;ll show you quizzes and mock tests for this exam.</p>
          <div className="mt-6 grid gap-2" role="radiogroup" aria-labelledby="exam-q">
            {status.exam_types.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={examTypeId === t.id}
                onClick={() => setExamTypeId(t.id)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${examTypeId === t.id ? "border-green-600 bg-green-50 ring-1 ring-green-600" : "border-gray-200 hover:border-gray-300"}`}
              >
                <span className="font-medium text-gray-900">{t.name}</span>
                {examTypeId === t.id && <Check className="h-5 w-5 text-green-700" />}
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => save({ skip: true })} disabled={saving} className="text-sm text-gray-500 underline-offset-4 hover:underline">Skip for now</button>
            <Button onClick={() => setStep(2)} disabled={!examTypeId} className="gap-1.5 bg-green-700 hover:bg-green-800">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      ) : (
        <section aria-labelledby="date-q">
          <h1 id="date-q" className="text-2xl font-bold text-gray-900">When is your exam?</h1>
          <p className="mt-1 text-gray-600">We&apos;ll pace your practice and remind you as it gets closer.</p>
          <label htmlFor="exam-month" className="mt-6 block text-sm font-medium text-gray-700">Exam month</label>
          <select
            id="exam-month"
            value={month}
            disabled={notSure}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 disabled:bg-gray-100"
          >
            <option value="">Choose month</option>
            {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <label className="mt-4 flex items-center gap-2 text-gray-700">
            <input type="checkbox" checked={notSure} onChange={(e) => { setNotSure(e.target.checked); if (e.target.checked) setMonth(""); }} className="h-4 w-4 accent-green-700" />
            Not sure yet
          </label>
          <div className="mt-8 flex items-center justify-between">
            {status.exam_locked ? <span /> : (
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back</Button>
            )}
            <Button
              onClick={() => save({ exam_type_id: examTypeId ?? undefined, exam_month: notSure ? null : month, not_sure: notSure })}
              disabled={saving || (!month && !notSure)}
              className="gap-1.5 bg-green-700 hover:bg-green-800"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Start my free quiz <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
