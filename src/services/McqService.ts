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

    getQuestionComments = async (slug: string) => {
        try {
            const response = await this.getRequest({
                url: `/free/mcq/${slug}/comments`,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    addQuestionComment = async (slug: string, payload: { name: string; comment: string }) => {
        try {
            const response = await this.postRequest({
                url: `/free/mcq/${slug}/comments`,
                data: payload,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
}

const mcqService = new McqService();
export default mcqService;