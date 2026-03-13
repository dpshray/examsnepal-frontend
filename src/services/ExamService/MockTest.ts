import HttpService from "@/services/ExamService/http.service";

class MockTest extends HttpService {
    getPendingMockTests = async (page: number = 1, tag?: string) => {
        try {
            const url = `/mock-test/pending?page=${page}${tag ? `&tag=${tag}` : ""}`
            const response = await this.getRequest({
                url,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }

    getCompletedMockTests = async (page: number = 1, tag?: string) => {
        try {
            const url = `/mock-test/completed?page=${page}${tag ? `&tag=${tag}` : ""}`
            const response = await this.getRequest({
                url,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
    
    getMockTestById = async (examId:number,params?:any) => {
        try {
           

            const response = await this.getRequest({
                url: `/mock-test/questions/${examId}`,
                config: {
                    auth: true,
                    params
                },
            });
            return response?.data;
        } catch (error:any) {
            console.log('getMockTestById',error)
            throw error?.data;
        }
    };


    submitExam = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `/submit-answer`,
                data,
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

const mockTestService = new MockTest();
export default mockTestService;