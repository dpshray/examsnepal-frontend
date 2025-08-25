import HttpService from "@/services/ExamService/http.service";

class DoubtService extends HttpService {
//     doubt/student/solved?page=1

    getSolvedDoubts = async (page: number) => {
        try {
            const response = await this.getRequest({
                url: `doubt/student/solved?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }

    }

    getUnsolvedDoubts = async (page: number) => {
        try {
            const response = await this.getRequest({
                url: `doubt/student/unsolved?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
    createDoubt = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `doubt`,
                data,
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

const doubtsService = new DoubtService();
export default doubtsService;