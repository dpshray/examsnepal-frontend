"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertCircle,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  Layers,
  Info,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetExamDetails } from "@/hooks/corporate/useCorporateExam";
import { useGetExamType } from "@/hooks/corporate/useCorporateExam";
import { formatStudentExamTime } from "@/lib/utils";
import InstructionsSkeleton from "@/components/skeleton/InstructionsSkeleton";

export default function InstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const examSlug = params?.examSlug as string;

  // Get exam type
  const { data: examTypeData, isLoading: isLoadingType } = useGetExamType(examSlug);
  const examType = examTypeData?.exam_type;

  // Get exam details
  const { data: getExamDetails, isPending: isLoadingDetails } = useGetExamDetails({examSlug: examSlug, type: examType});
  const examData = getExamDetails?.data;

  const handleStartExam = () => {
    router.push(`/exam/${examSlug}/attempt`);
  };

  const isLoading = isLoadingType || isLoadingDetails;

  if (isLoading) {
    return <InstructionsSkeleton />
  }

  if (!examData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Failed to load exam details</p>
        </div>
      </div>
    );
  }

  const parseInstructions = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Check if attempts limit is reached - properly handle null
  const hasAttemptsLimit = examData.limit_attempts !== null && examData.limit_attempts !== undefined;
  
  // Only check for limit if there actually is a limit (not null/unlimited)
  const sectionsWithLimitReached = examData.sections.filter(
    (section: any) => hasAttemptsLimit && section.attempts_count >= examData.limit_attempts
  );
  
  const isAttemptLimitReached = sectionsWithLimitReached.length > 0;

  // Calculate completed sections
  const completedSectionsCount = examData.sections.filter((s: any) => s.is_completed).length;
  const allSectionsCompleted = completedSectionsCount === examData.sections.length;
  
  // For unlimited attempts, users can always retake. Only disable if:
  // 1. There's a limit AND all sections have reached that limit
  const allSectionsReachedLimit = hasAttemptsLimit && 
    examData.sections.every((section: any) => section.attempts_count >= examData.limit_attempts);
  
  const canStartExam = !allSectionsReachedLimit;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Compact Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{examData.title}</h1>
                <p className="text-sm text-gray-600">{examData.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Show original time range */}
              {examData.start_time && examData.end_time && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-100 px-3 py-1.5 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatStudentExamTime(examData.start_time)} - {formatStudentExamTime(examData.end_time)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
          {/* Compact Info Grid */}
          <div className="">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-base sm:text-2xl font-bold">{examData.duration}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Minutes</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-base sm:text-2xl font-bold">{examData.limit_attempts ?? "∞"}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Attempts</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-base sm:text-2xl font-bold capitalize">{examData.exam_type}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Type</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Layers className="h-4 w-4" />
                  <span className="text-base sm:text-2xl font-bold">{completedSectionsCount}/{examData.sections.length}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Completed</span>
              </div>
            </div>

            {/* Instructions */}
            {examData.instructions && (
              <div className="p-5 border-green-100">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3 uppercase tracking-wide">
                  <Info className="h-4 w-4" />
                  Instructions
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed border-l-3 border-green-500 pl-4 wrap-break-word">
                  {parseInstructions(examData.instructions)}
                </p>
              </div>
            )}
          </div>

          {/* Section List - Display Only (No Selection) */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Available Sections
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {examData.sections.map((section: any, index: number) => {
                // Only check limit if there is one (not null/unlimited)
                const isLimitReached = hasAttemptsLimit && section.attempts_count >= examData.limit_attempts;
                
                return (
                  <div
                    key={section.slug}
                    className={`flex items-start gap-4 p-5 ${section.is_completed ? 'bg-green-50/50' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                          <BookOpen className="h-4 w-4 text-green-600 shrink-0" />
                          <span>{section.title}</span>
                        </h3>
                        {section.is_completed && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {isLimitReached && !section.is_completed && (
                          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                            <XCircle className="h-3 w-3" />
                            Limit Reached
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 ml-7">
                        {section.detail}
                      </p>
                      {/* Only show attempt count if there's a limit */}
                      {hasAttemptsLimit && (
                        <p className="text-xs text-gray-500 ml-7 mt-1">
                          Attempts: {section.attempts_count} / {examData.limit_attempts}
                        </p>
                      )}
                      {/* Show retake available message for unlimited attempts */}
                      {!hasAttemptsLimit && section.is_completed && (
                        <p className="text-xs text-green-600 ml-7 mt-1">
                          You can retake this section
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning Messages */}
          {allSectionsReachedLimit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900">All Attempts Exhausted</h3>
                  <p className="text-sm text-red-700 mt-1">
                    You have reached the maximum number of attempts ({examData.limit_attempts}) for all sections. No further attempts are available.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isAttemptLimitReached && !allSectionsReachedLimit && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Some Sections Unavailable</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    {sectionsWithLimitReached.length} section(s) have reached the maximum attempts ({examData.limit_attempts}). You can still attempt the remaining sections.
                  </p>
                </div>
              </div>
            </div>
          )}

          {allSectionsCompleted && !hasAttemptsLimit && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900">All Sections Completed</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Great job! You&apos;ve completed all sections. You can retake any section as there&apos;s no attempt limit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer with Start Button */}
      <footer className="border-t shadow-lg">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {allSectionsReachedLimit ? (
                <p className="text-gray-600">
                  All sections have reached their attempt limit.
                </p>
              ) : allSectionsCompleted && !hasAttemptsLimit ? (
                <p className="text-gray-600">
                  All sections completed. You can retake any section.
                </p>
              ) : isAttemptLimitReached ? (
                <p className="text-gray-600">
                  Some sections have reached their limit. You can still attempt others.
                </p>
              ) : (
                <p className="text-gray-600">
                  Click &quot;Start Exam&quot; to begin. You can select sections once inside.
                </p>
              )}
            </div>
            <Button
              onClick={handleStartExam}
              variant="green"
              className="gap-2"
              disabled={!canStartExam}
            >
              {allSectionsReachedLimit ? "No Attempts Remaining" : "Start Exam"}
              {canStartExam && <ArrowRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}