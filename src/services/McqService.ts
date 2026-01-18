import HttpServices from "@/services/ExamService/http.service";

class McqService extends HttpServices {

    searchMcq = async (keyword: string, page: number = 1) => {
        try {
            const encodedKeyword = encodeURIComponent(keyword);
            const response = await this.getRequest({

                url: `search-questions?page=${page}&keyword=${encodedKeyword}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    searchMcqWithoutAuth = async (keyword: string, page: number = 1) => {
        try {
            const encodedKeyword = encodeURIComponent(keyword);
            const response = await this.getRequest({

                url: `/free/search-questions?page=${page}&keyword=${encodedKeyword}`,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
}

const mcqService = new McqService();
export default mcqService;