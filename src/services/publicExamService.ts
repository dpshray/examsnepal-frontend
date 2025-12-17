import HttpServices from "./ExamService/http.service";


class PublicExamService extends HttpServices {
    publicExamLogin = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `/public-exam/login`,
                data,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

const publicExamService = new PublicExamService();
export default publicExamService;