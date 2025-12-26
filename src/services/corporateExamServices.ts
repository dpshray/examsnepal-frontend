import { ExamType } from "@/types/CorporateExamTypes";
import HttpServices from "./ExamService/http.service";

export interface PageParams {
    page: number;
    per_page: number;
}

const getTokenType = (type: ExamType) => {
    return type === "private"
        ? localStorage.getItem("_student_exam_at")
        : localStorage.getItem("_public_exam_attempt");
}


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

    getExamDetails = async (examSlug: string, type: ExamType) => {
        try {
            const token = getTokenType(type);

            const response = await this.getRequest({
                url: `/exams/${examSlug}/examsdetail`,
                config: {
                    auth: true,
                    useToken: token as string, 
                },
            });

            return response?.data;
        } catch (error) {
            throw error;
        }
    };

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

    startExam = async (examSlug: string, sectionSlug: string, type: ExamType) => {
        try {
            const token = getTokenType(type);

            const response = await this.postRequest({
                url: `/exam/${examSlug}/section/${sectionSlug}/startexam`,
                config: {
                    auth: true,
                    useToken: token as string,
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    getQuestion = async (attempt_id: number, type: ExamType, params?: PageParams) => {
        try {
            const token = getTokenType(type);
            const response = await this.getRequest({
                url: `/get-question/${attempt_id}`,
                config: {
                    auth: true,
                    useToken: token as string,
                    params,
                }
            })
            return response?.data
        } catch (error) {
            console.error(error);
        }
    }

    saveAnswer = async (attempt_id: number, data: any, type: ExamType) => {
        try {
            const token = getTokenType(type);
            const response = await this.postRequest({
                url: `/submit-answer/${attempt_id}`,
                data,
                config: {
                    auth: true,
                    useToken: token as string,
                }
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    submitExam = async (attempt_id: number, type: ExamType) => {
        try {
            const token =getTokenType(type);
            const response = await this.postRequest({
                url: `/submit-exam/${attempt_id}`,
                config: {
                    auth: true,
                    useToken: token as string,
                }
           })
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

const corporateExamService = new CorporateExamService();
export default corporateExamService;