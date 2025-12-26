"use client";

import { PrivateExamForm } from "@/app/exam/[examSlug]/page";
import corporateExamService, { PageParams } from "@/services/corporateExamServices";
import { ExamType } from "@/types/CorporateExamTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useGetExamDetails = (examParams: { examSlug: string; type: ExamType }) => {
    return useQuery({
        queryKey: ["participants", examParams],
        queryFn: () => corporateExamService.getExamDetails(examParams.examSlug, examParams.type),
        enabled: !!examParams.examSlug && !!examParams.type,
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

export const useStartExam = () => {
    return useMutation({
        mutationFn: ({examSlug, sectionSlug, type}: {examSlug: string; sectionSlug: string, type: ExamType}) => corporateExamService.startExam(examSlug, sectionSlug, type),
    });
};

export const useGetQuestions = (attempt_id: number, type: ExamType, params?: PageParams) => {
  return useQuery({
    queryKey: ["questions", attempt_id, type, params],
    queryFn: () => corporateExamService.getQuestion(attempt_id, type, params),
  });
}

export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: ({attemptId, data, type}: {attemptId: number, data: any, type: ExamType}) => corporateExamService.saveAnswer(attemptId, data, type),
  });
}

export const useSubmitExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({attemptId, type }: {attemptId: number, type: ExamType}) => corporateExamService.submitExam(attemptId, type),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            localStorage.removeItem(`exam_end_time_${variables.attemptId}`)
        }
    });
}
