"use client";

import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import ExamRouteSkeleton from "@/components/skeleton/ExamRouteSkeleton";
import useExamAccess from "@/hooks/useExamAccess";
import { useGetExamType } from "@/hooks/useCorporateExam";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { examSlug } = useParams<{ examSlug: string }>();

  const isEntryPage = pathname === `/exam/${examSlug}`;

  const { data, isLoading: isTypeLoading } = useGetExamType(examSlug!); 
  const examType = data?.type as "public" | "private" | null;

  const { loading: isAccessLoading, authorized } = useExamAccess({
    skip: isEntryPage || !examType,
    type: examType || "public",
  });

  if (isTypeLoading || isAccessLoading) {
    return <ExamRouteSkeleton />;
  }

  if (!authorized) {
    return <ExamRouteSkeleton />;
  }

  return <>{children}</>;
}
