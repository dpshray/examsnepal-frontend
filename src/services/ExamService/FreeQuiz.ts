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

    getFreeQuizById = async (examId: number, params?: any) => {
        try {


            const response = await this.getRequest({
                url: `/free-quiz/questions/${examId}`,
                config: {
                    auth: true,
                    params
                },
            });

            return response?.data;
        } catch (error: any) {
            console.log('getFreeQuizById', error?.data)
            throw error?.data;
        }
    };


}


const freeQuizServices = new FreeQuizServices();
export default freeQuizServices;