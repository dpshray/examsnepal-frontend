import { GetParams } from "@/config/app-constant";
import blogService from "@/services/blogService";
import { useQuery } from "@tanstack/react-query";

export function useGetAllClientBlogs(params: GetParams = {}) {
  return useQuery({
    queryKey: ["client-blogs", params],
    queryFn: () => blogService.getAllBlogs(params),
  });
}

export function useGetClientBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ["client-blog-detail", slug],
    queryFn: () => blogService.getClientBlogBySlug(slug!),
    enabled: !!slug,
  });
}
