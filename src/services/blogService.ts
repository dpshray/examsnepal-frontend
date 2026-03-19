import { GetParams } from "@/config/app-constant";
import HttpServices from "@/services/ExamService/http.service";

class BlogService extends HttpServices {

    // getAllBlogs = async (page: number = 1) => {
    //     try {
    //         const response = await this.getRequest({
    //             url: `/blog/?page=${page}`,
    //         });
    //         return response?.data;
    //     } catch (error) {
    //         console.error('Error fetching all blogs from BlogService:', error);
    //         throw error;
    //     }
    // }
    getAllBlogs = async (params?: GetParams) => {
        try {
            const response = await this.getRequest({
                url: "/user/blogs",
                config: {
                    params
                }
            });
            return response?.data;
        } catch (error) {
            console.error('Error fetching all blogs from BlogService:', error);
            throw error;
        }
    }

    async getClientBlogBySlug(slug: string) {
        try {
            const response = await this.getRequest({
                url: `/user/blogs/${slug}`,
            });
            return response?.data?.data;
        } catch (error) {
            console.error(`Error fetching blog: ${error}`);
            throw error;
        }
    }
}

const blogService = new BlogService();
export default blogService;