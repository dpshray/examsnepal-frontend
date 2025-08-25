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

    getSprintQuizById = async ({id, page = 1, token = ''}: { id: number; page?: number; token?: string | null }) => {
        try {
            const queryParams = [`page=${page}`];
            if (token) queryParams.push(`token=${token}`);

            const response = await this.getRequest({
                url: `/sprint-quiz/questions/${id}?${queryParams.join('&')}`,
                config: {
                    auth: true,
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