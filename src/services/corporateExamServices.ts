import HttpServices from "./ExamService/http.service";


class CorporateExamService extends HttpServices {
    privateExamLogin = async (examSlug: string, data: any) => {
        try {
            const response = await this.postRequest({
                url: `/exam/${examSlug}/private-login`,
                data,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    publicExamLogin = async (examSlug: string, data: any) => {
        try {
            const response = await this.postRequest({
                url: `/exam/${examSlug}/register-public`,
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

    getExamType = async (examSlug: string) => {
        try {
            const response = await this.getRequest({
                url: `/exam-type/${examSlug}`,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

const corporateExamService = new CorporateExamService();
export default corporateExamService;