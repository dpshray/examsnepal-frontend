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
                                 token = ""
                             }: {
        id: number;
        page?: number;
        token?: string;
    }): Promise<any> => {
        try {
            // ✅ Build query params conditionally
            let queryParams = `?page=${page}`;
            if (page !== 1 && token) {
                queryParams += `&token=${token}`;
            }

            const response = await this.getRequest({
                url: `/free-quiz/questions/${id}${queryParams}`,
                config: {
                    auth: true,
                },
            });

            return response?.data;
        } catch (error: any) {

        }
    };


}


const freeQuizServices = new FreeQuizServices();
export default freeQuizServices;