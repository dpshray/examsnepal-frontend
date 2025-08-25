import HttpService from "@/services/ExamService/http.service";


class ForumService extends HttpService {

    addForumQuestion = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `/student/addquestion`,
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

    getAllForumQuestions = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/student/questions?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
    deleteOwnForumQuestion = async (id: number) => {
        try {
            const response = await this.deleteRequest({
                url: `/student/questions/${id}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
    editOwnForumQuestion = async (id: number, data: any) => {
        try {
            const response = await this.putRequest({
                url: `/student/questions/edit/${id}`,
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
    addReply = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: `/student/answers`,
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

const forumService = new ForumService();
export default forumService;