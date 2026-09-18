import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import studentService from "@/services/StudentService";
import { toast } from "sonner";

export const useToggleNameVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentService.toggleNameVisibility(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Name visibility toggled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to toggle name visibility");
    },
  });
};
