import HttpService from "@/services/ExamService/http.service";

class AuthService extends HttpService {

    studentLogin = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: 'student/login',
                data: data,
            })
            return response.data
        } catch (error) {
            throw error
        }

    }
    studentRegister = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: 'student/register',
                data: data,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    forgotPassword = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: '/student-password-reset',
                data: data,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    verifyForgotPasswordOtp = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: '/verify-password-reset-otp',
                data: data,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    resetPassword = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: '/handle-password-reset-form',
                data: data,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    getExamTypes = async () => {
        try {
            const response = await this.getRequest({
                url: '/exam-types',
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    logout = async () => {
        try {
            const response = await this.getRequest({
                url: '/student/logout',
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    refreshJWTToken = async () => {
        try {
            const response = await this.getRequest({
                url: '/student/refresh-token',
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export const authService = new AuthService();