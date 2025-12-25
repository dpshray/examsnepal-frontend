import HttpService from "@/services/ExamService/http.service";

class ScoreService extends HttpService {
    async getAllScore(examId: number,params?:any) {
        const response = await this.getRequest({
            url: `/exam-scorers/${examId}`,
            config: {
                auth: true,
                params
            }
        })
        return response?.data;
    }

    async getProfileScore() {
        try {
            const response = await this.getRequest({
                url: `/students/me/exams/scores`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    async getOwnScore(examId: number) {
        try {
            const response = await this.getRequest({
                url: `/students/get-my-exams-score/${examId}`,
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

const scoreService = new ScoreService();
export default scoreService;
