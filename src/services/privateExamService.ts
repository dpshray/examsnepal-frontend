import HttpServices from "./ExamService/http.service";


class PrivateExamService extends HttpServices {
    privateExamLogin = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `/private-login`,
                data,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    getExamDetails = async (examSlug: string) => {
        try {
            const response = await this.getRequest({
                url: `/exam/${examSlug}`,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

const privateExamService = new PrivateExamService();
export default privateExamService;