import HttpServices from "@/services/ExamService/http.service";

class McqService extends HttpServices {

    searchMcq = async (keyword: string, page: number = 1) => {
        try {
            const response = await this.getRequest({

                url: `search-questions?page=${page}&keyword=${keyword}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }



}

const mcqService = new McqService();
export default mcqService;