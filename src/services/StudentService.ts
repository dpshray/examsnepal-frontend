import HttpServices from "./ExamService/http.service";


class StudentService extends HttpServices {

    getQuestionPoolRequest = async (token = process.env.NEXT_PUBLIC_POOL_TOKEN) => {
        // url: `request-pool-question?token=${process.env.NEXT_PUBLIC_POOL_TOKEN}`
        try {
            const response = await this.getRequest({
                url: `request-pool-question?token=${token}`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
    sendQuestionPoolRequest = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `send-pool-response`,
                data,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
    getPoolScore = async (page = 1) => {
        try {
            const response = await this.getRequest({
                url: `get-todays-pool-players?page=${page}`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
    getLoggedInUser = async () => {
        try {
            const response = await this.getRequest({
                url: `/student-profile-fetcher`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    updateProfile = async (data: any) => {
        try {
            const response = await this.putRequest({
                url: `/update-student-profile`,
                data,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
    logout = async () => {
        try {
            const response = await this.postRequest({
                url: `/student/logout`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    totalExamCount = async () => {
        try {
            const response = await this.getRequest({
                url: `/total-exam-count`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    getTotalSubjects = async () => {
        try {
            const response = await this.getRequest({
                url: `/subjects`,
                config: {
                    auth: true
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

const studentService = new StudentService();
export default studentService;