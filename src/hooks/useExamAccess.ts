"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type ExamType = "public" | "private";

interface UseExamAccessOptions {
    skip?: boolean;
    type: ExamType;
}

export default function useExamAccess({
    skip = false,
    type,
}: UseExamAccessOptions) {
    const router = useRouter();
    const { examSlug } = useParams<{ examSlug: string }>();

    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (skip) {
            setAuthorized(true);
            setLoading(false);
            return;
        }

        const token =
            type === "private"
                ? localStorage.getItem("_student_exam_at")
                : localStorage.getItem("_public_exam_attempt");

        if (!token) {
            router.replace(`/exam/${examSlug}`);
            return;
        }

        setAuthorized(true);
        setLoading(false);
    }, [skip, type, examSlug, router]);

    return { authorized, loading };
}

