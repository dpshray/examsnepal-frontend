"use client";

import { usePathname, useParams } from "next/navigation";
import ExamRouteSkeleton from "@/components/skeleton/ExamRouteSkeleton";
import useExamAccess from "@/hooks/useExamAccess";

export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { examSlug } = useParams<{ examSlug: string }>();

    const isEntryPage = pathname === `/exam/${examSlug}`;

    const { loading, authorized } = useExamAccess({
        skip: isEntryPage,
    });

    if (loading) {
        return <ExamRouteSkeleton />;
    }

    if (!authorized) {
        return <ExamRouteSkeleton />;
    }

    return <>{children}</>;
}
