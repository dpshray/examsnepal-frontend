import HttpServices from "@/services/ExamService/http.service";

class BlogService extends HttpServices {

    getAllBlogs = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/blog/?page=${page}`,
            });
            return response?.data;
        } catch (error) {
            console.error('Error fetching all blogs from BlogService:', error);
            throw error;
        }
    }


}

const blogService = new BlogService();
export default blogService;