"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";

interface UseExamAccessOptions {
    skip?: boolean;
}

export default function useExamAccess({ skip = false }: UseExamAccessOptions = {}) {
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

        const privateToken = localStorage.getItem("_student_exam_at");
        const publicToken = localStorage.getItem("_public_exam_attempt");

        if (!privateToken && !publicToken) {
            router.replace(`/exam/${examSlug}`);
            return;
        }

        setAuthorized(true);
        setLoading(false);
    }, [skip, examSlug, router]);

    return { authorized, loading };
}
