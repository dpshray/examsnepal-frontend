"use client";

import { PrivateExamForm } from "@/app/exam/[examSlug]/page";
import corporateExamService from "@/services/corporateExamServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type PrivateExamLoginVars = {
    examSlug: string;
    payload: PrivateExamForm;
};

export const usePrivateExamLogin = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) => {
    const router = useRouter();
    return useMutation({
        mutationFn: ({ examSlug, payload }: PrivateExamLoginVars) =>
            corporateExamService.privateExamLogin(examSlug, payload),

        onSuccess: (data) => {
            // console.log("data", data?.data);
            if (data?.data?.token) {
                localStorage.setItem("_student_exam_at", data?.data.token);
            }
            onSuccess?.(data);
        },

        onError: (error) => {
            onError?.(error);
        },
    });
};

export const usePublicExamLogin = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) => {
    return useMutation({
        mutationFn: ({ examSlug, payload }: PrivateExamLoginVars) =>
            corporateExamService.publicExamLogin(examSlug, payload),

        onSuccess: (response) => {
            /** 
             * Public exam does NOT store a user token.
             * Usually backend returns an attempt/session token.
             */
            const token = response.data[0]?.token;
            console.log("data", token);
            if (token) {
                localStorage.setItem("_public_exam_attempt", token);
            }

            onSuccess?.(response);
        },

        onError: (error) => {
            onError?.(error);
        },
    });
};

export const useGetExamDetails = (onSuccess?: (data: any) => void) => {
    const router = useRouter();
    return useMutation({
        mutationFn: ({  examSlug, type }: {examSlug: string, type: "public" | "private"}) => corporateExamService.getExamDetails(examSlug, type),

        onSuccess: (data) => {
            onSuccess?.(data);
        },
    });
};

export const useGetExamType = (examSlug: string) => {
  return useQuery({
    queryKey: ["exam-type", examSlug],
    queryFn: () => corporateExamService.getExamType(examSlug),
    staleTime: 5 * 60 * 1000, 
    enabled: !!examSlug,     
  });
};
