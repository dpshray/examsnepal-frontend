// hooks/exam/usePrivateExamLogin.ts
"use client";

import privateExamService from "@/services/privateExamService";
import publicExamService from "@/services/publicExamService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const usePrivateExamLogin = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: any) =>
            privateExamService.privateExamLogin(payload),

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
        mutationFn: (payload: any) =>
            publicExamService.publicExamLogin(payload),

        onSuccess: (data) => {
            /** 
             * Public exam does NOT store a user token.
             * Usually backend returns an attempt/session token.
             */
            if (data?.attempt_token) {
                localStorage.setItem("_public_exam_attempt", data.attempt_token);
            }

            onSuccess?.(data);
        },

        onError: (error) => {
            onError?.(error);
        },
    });
};

export const useGetExamDetails = (onSuccess?: (data: any) => void) => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: any) => privateExamService.getExamDetails(payload),

        onSuccess: (data) => {
            onSuccess?.(data);
        },
    });
};
