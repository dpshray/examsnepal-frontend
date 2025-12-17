import HttpService from "@/services/ExamService/http.service";

class SprintQuizServices extends HttpService {
    getCompleteSprintQuizzes = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/sprint-quiz/completed?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
    getPendingSprintQuizzes = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/sprint-quiz/pending?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    getSprintQuizById = async (examId:number,params?:any) => {
        try {
            
            const response = await this.getRequest({
                url: `/sprint-quiz/questions/${examId}`,
                config: {
                    auth: true,
                    params,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    };
}

const sprintQuizServices = new SprintQuizServices();
export default sprintQuizServices;