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

    getFreeQuizById = async ({id, page = 1, token = ''}: {id: number; page?: number; token?: string | null }) => {
        try {
            const queryParams = [`page=${page}`];
            if (token) queryParams.push(`token=${token}`);

            const response = await this.getRequest({
                url: `/free-quiz/questions/${id}?${queryParams.join('&')}`,
                config: {
                    auth: true,
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