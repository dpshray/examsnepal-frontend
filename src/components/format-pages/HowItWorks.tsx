import { ListChecks, PlayCircle, Sparkles, Target } from "lucide-react";
import type { FormatDefinition } from "./formatData";

const STEPS = [
    { icon: Target, title: "Pick your exam category", description: "Choose the Loksewa, license, or entrance exam you're preparing for." },
    { icon: PlayCircle, title: "Start the quiz", description: "Jump straight in — no setup, no waiting." },
    { icon: ListChecks, title: "Answer the questions", description: "Work through the MCQs at your own pace, or against the clock." },
    { icon: Sparkles, title: "Get instant score & explanations", description: "See your result immediately, with an explanation for every question." },
];

export default function HowItWorks({ format }: { format: FormatDefinition }) {
    return (
        <section className="bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-8 text-center">
                    How {format.shortName} works
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.title} className="flex flex-col items-center text-center bg-white rounded-xl border border-border p-5 shadow-sm">
                                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                    <Icon className="w-5 h-5 text-green-700" aria-hidden="true" />
                                </div>
                                <span className="text-xs font-semibold text-green-700 mb-1">Step {index + 1}</span>
                                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
