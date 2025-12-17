import HttpService from "@/services/ExamService/http.service";

class ExamService extends HttpService {

    getExamById = async ({id, page = 1}: { id: number; page?: number; }) => {
        try {
            const response = await this.getRequest({
                url: `view-solutions/${id}?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
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

    async getScore(examId:number){
        const response = await this.getRequest({
            url: `/exam-scorers/${examId}`,
            config:{
                auth: true,
            }
        })
        return response?.data;
    }
}


const examService = new ExamService();
export default examService;