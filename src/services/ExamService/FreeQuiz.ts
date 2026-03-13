import HttpService from "@/services/ExamService/http.service";

class FreeQuizServices extends HttpService {


   getCompleteFreeQuizzes = async (page: number = 1, tag?: string) => {
        try {
            const url = `/free-quiz/completed?page=${page}${tag ? `&tag=${tag}` : ""}`
            const response = await this.getRequest({
                url,
                config: {
                    auth: true,
                },
            })
            return response?.data
        } catch (error) {
            throw error;
        }
    }

    getPendingFreeQuizzes = async (page: number = 1, tag?: string) => {
        try {
            const url = `/free-quiz/pending?page=${page}${tag ? `&tag=${tag}` : ""}`
            const response = await this.getRequest({
                url,
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