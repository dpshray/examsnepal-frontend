import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Circle } from "lucide-react";

// Illustrated mock-test preview replacing the old static hero image - shows
// what taking a test on the platform actually looks like (progress bar,
// answer options, live rank) rather than generic stock-style artwork.
function MockTestPreviewCard() {
    return (
        <div className="w-full max-w-sm rounded-3xl bg-slate-50 p-7 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Kharidar Mock Test</span>
                    <span className="text-xs text-gray-400">12 / 50</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-1/4 rounded-full bg-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                    Which body conducts the Kharidar exam?
                </p>
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5">
                        <Check className="h-[18px] w-[18px] shrink-0 text-green-700" aria-hidden="true" />
                        <span className="text-sm text-green-900">Public Service Commission</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                        <Circle className="h-[18px] w-[18px] shrink-0 text-gray-300" aria-hidden="true" />
                        <span className="text-sm text-gray-600">Ministry of Home Affairs</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                        <Circle className="h-[18px] w-[18px] shrink-0 text-gray-300" aria-hidden="true" />
                        <span className="text-sm text-gray-600">Nepal Rastra Bank</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-xs text-gray-500">
                    Live rank: <strong className="text-gray-900">#48</strong> of 1,204
                </span>
                <span className="text-xs font-semibold text-green-700">+2 today</span>
            </div>
        </div>
    );
}

export const HeroSection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-28 flex items-center justify-center">
            <div
                className="container mx-auto flex flex-col lg:flex-row lg:justify-between items-center gap-10 px-6 md:px-12">

                {/* Left Content */}
                <div className="w-full lg:w-1/2 text-center font-montserrat lg:text-left">
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        194,000+ practice questions, always free
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 ">
                        Online&nbsp;<span className="text-green-600">Loksewa</span>, PSC &amp; Entrance
                        Exam Preparation for Nepal
                    </h1>
                    <p className="text-gray-700 mt-4 text-base sm:text-lg leading-relaxed">
                        Free mock tests, past questions, and real-time ranking for Loksewa, IOE, CEE
                        medical/dental, nursing, and NEC license exams.
                    </p>

                    <div
                        className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                    >
                        <Button
                            asChild
                            variant="default"
                            className="bg-green-600 text-white hover:bg-green-700 transition duration-300 shadow-md"
                        >
                            <Link href="/register">
                                Get Started
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition duration-300 shadow-md"
                        >
                            <Link href="/exams">
                                Browse Exams
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-8 border-t border-gray-100 pt-5 lg:justify-start">
                        <div>
                            <div className="text-xl font-bold text-gray-900">30+</div>
                            <div className="text-xs text-gray-500">exams covered</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">194K+</div>
                            <div className="text-xs text-gray-500">MCQs</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">Free</div>
                            <div className="text-xs text-gray-500">to start</div>
                        </div>
                    </div>
                </div>

                {/* Right: illustrated mock-test preview */}
                <div className="w-full md:w-1/2 hidden md:flex items-center justify-end">
                    <MockTestPreviewCard />
                </div>
            </div>
        </section>
    );
};
