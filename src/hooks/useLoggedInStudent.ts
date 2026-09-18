import { useQuery } from "@tanstack/react-query";
import studentService from "@/services/StudentService";

export function useLoggedInStudent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await studentService.getLoggedInUser();
      return response?.data ?? null;
    },
  });

  return { student: data ?? null, loading: isLoading, error };
}
