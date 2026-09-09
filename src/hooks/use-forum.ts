import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import forumService from "@/services/ForumService";

interface ReportForumPayload {
  report_type: string;
  reason?: string;
  forum_question_id?: number;
  forum_answer_id?: number;
}

export function useReportForumContent() {
  return useMutation({
    mutationFn: ({
      report_type,
      forum_question_id,
      forum_answer_id,
      reason,
    }: ReportForumPayload) =>
      forumService.reportForumQuestion(
        report_type,
        forum_question_id,
        forum_answer_id,
        reason,
      ),
    onSuccess: (data) => {
      toast.success(data?.message || "Report submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || "Failed to submit report");
      //   console.log("eeeeeeeeeeeeeeeeeeeeeeeee", error);
      //   const errorMessage =
      //     error?.data?.errors || error?.message || error?.data?.message || "Failed to submit report";
      //   if (typeof errorMessage === "object") {
      //     const firstError = Object.values(errorMessage)[0] as string[];
      //     toast.error(firstError?.[0] || "Failed to submit report");
      //   } else {
      //     toast.error(errorMessage);
      //   }
    },
  });
}

export function useDeleteForumReply() {
  return useMutation({
    mutationFn: (id: number) => forumService.deleteFormReply(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Reply deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.errors ||
        error?.message ||
        error?.data?.message ||
        "Failed to delete reply";
      if (typeof errorMessage === "object") {
        const firstError = Object.values(errorMessage)[0] as string[];
        toast.error(firstError?.[0] || "Failed to delete reply");
      } else {
        toast.error(errorMessage);
      }
    },
  });
}

//block
export const useGetBlockedUsers = () => {
  return useQuery({
    queryKey: ["blocked-users"],
    queryFn: () => forumService.getBlockedUsers(),
  });
};

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => forumService.blockUser(id),
    onSuccess: (data) => {
      toast.success(data?.message || "User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.errors ||
        error?.message ||
        error?.data?.message ||
        "Failed to block user";
      if (typeof errorMessage === "object") {
        const firstError = Object.values(errorMessage)[0] as string[];
        toast.error(firstError?.[0] || "Failed to block user");
      } else {
        toast.error(errorMessage);
      }
    },
  });
}

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => forumService.unblockUser(id),
    onSuccess: (data) => {
      toast.success(data?.message || "User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.errors ||
        error?.message ||
        error?.data?.message ||
        "Failed to unblock user";
      if (typeof errorMessage === "object") {
        const firstError = Object.values(errorMessage)[0] as string[];
        toast.error(firstError?.[0] || "Failed to unblock user");
      } else {
        toast.error(errorMessage);
      }
    },
  });
};
