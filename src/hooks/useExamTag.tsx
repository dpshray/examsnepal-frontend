import examService from "@/services/ExamService/ExamService";
import { useQuery } from "@tanstack/react-query";

export const useExamTagByExamType = (examTypeId: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["exam-tags-by-type", examTypeId],
        queryFn: () => examService.getExamTagByExamType(examTypeId),
        enabled: !!examTypeId,
        ...options,
    });
};