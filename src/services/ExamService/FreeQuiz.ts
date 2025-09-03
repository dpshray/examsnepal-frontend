import HttpService from "@/services/ExamService/http.service";

class FreeQuizServices extends HttpService {


    getCompleteFreeQuizzes = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/free-quiz/completed?page=${page}`,
                config: {
                    auth: true,
                },
            })
            return response?.data
        } catch (error) {
            throw error;
        }
    }
    getPendingFreeQuizzes = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/free-quiz/pending?page=${page}`,
                config: {
                    auth: true,
                },
            })
            return response?.data
        } catch (error) {
            throw error;
        }
    }

    getFreeQuizById = async ({
                                 id,
                                 page = 1,
                                 token = "",
                             }: {
        id: number;
        page?: number;
        token?: string;
    }): Promise<any> => {
        try {
            const response = await this.getRequest<any>({
                url: `/free-quiz/questions/${id}`,
                config: {
                    auth: true,
                    params: {
                        page,
                        ...(page !== 1 && token ? {token} : {}),
                    },
                },
            });

            return response?.data;
        } catch (error: any) {
            console.error(`Failed to fetch free quiz ${id}:`, error);
            throw error;
        }
    };


}


const freeQuizServices = new FreeQuizServices();
export default freeQuizServices;