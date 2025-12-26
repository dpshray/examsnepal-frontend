"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FileText,
  AlertCircle,
  Loader2,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  Layers,
  Info,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useGetExamDetails, useStartExam } from "@/hooks/useCorporateExam";
import { useGetExamType } from "@/hooks/useCorporateExam";
import { toast } from "sonner";
import { FormatExamTime } from "@/lib/utils";

export default function InstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const examSlug = params?.examSlug as string;

  const [selectedSection, setSelectedSection] = useState<string>("");

  // Get exam type
  const { data: examTypeData, isLoading: isLoadingType } = useGetExamType(examSlug);
  const examType = examTypeData?.exam_type;

  // Get exam details
  const { data: getExamDetails, isPending: isLoadingDetails } = useGetExamDetails({examSlug: examSlug, type: examType});
  const examData = getExamDetails?.data;

  const { mutate: startExam, isPending } = useStartExam();

  const handleSectionClick = (sectionSlug: string) => {
    setSelectedSection(sectionSlug);
  };

  const handleStartExam = () => {
    if (!selectedSection) {
      return;
    }

    startExam({ examSlug, sectionSlug: selectedSection, type: examType },  {
      onSuccess: (response) => {
        console.log("Success response:", response);
        const attemptId = response.data.attempt_id;
        console.log("attemptId", attemptId);
        router.push(`/exam/${examSlug}/attempt/${attemptId}`);
        toast.success("Exam started successfully!");
      },
      onError: (err: any) => {
        toast.error(err?.data?.message || "Error starting the exam!");
      },
    });
  };

  const isLoading = isLoadingType || isLoadingDetails;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading exam details...</p>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-100 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{FormatExamTime(examData.start_time)} - {FormatExamTime(examData.end_time)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
          {/* Compact Info Grid */}
          <div className="">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-bold">{examData.duration}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Minutes</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-2xl font-bold">{examData.limit_attempts ?? "Unlimited"}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Attempts</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-2xl font-bold capitalize">{examData.exam_type}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Type</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Layers className="h-4 w-4" />
                  <span className="text-2xl font-bold">{examData.sections.length}</span>
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider">Sections</span>
              </div>
            </div>

            {/* Instructions */}
            {examData.instructions && (
              <div className="p-5  border-green-100">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3 uppercase tracking-wide">
                  <Info className="h-4 w-4" />
                  Instructions
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed border-l-3 border-green-500 pl-4">
                  {parseInstructions(examData.instructions)}
                </p>
              </div>
            )}
          </div>

          {/* Section Selection - All in One Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Select One Section to Begin
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {examData.sections.map((section: any, index: number) => (
                <div
                  key={section.slug}
                  onClick={() => handleSectionClick(section.slug)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-all duration-200 ${
                    selectedSection === section.slug.toString()
                      ? "bg-green-50"
                      : "hover:bg-green-50/50"
                  }`}
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    selectedSection === section.slug.toString()
                      ? "border-green-600 bg-green-600"
                      : "border-gray-300"
                  }`}>
                    {selectedSection === section.slug.toString() && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                        <BookOpen className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{section.title}</span>
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      {section.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer with Start Button */}
      <footer className="border-t shadow-lg">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {selectedSection ? (
                <p className="text-green-700 font-medium">
                  ✓ section selected
                </p>
              ) : (
                <p className="text-amber-600 font-medium">
                  ⚠ Please select a section to continue
                </p>
              )}
            </div>
            <Button
              onClick={handleStartExam}
              variant="green"
              disabled={!selectedSection || isPending}
              className="gap-2"
            >
              {isPending ? "Starting..." : "Start Exam"}
              {!isPending && <ArrowRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}