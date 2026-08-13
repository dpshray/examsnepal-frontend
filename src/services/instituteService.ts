import { GetParams } from "@/config/app-constant";
import HttpServices from "@/services/ExamService/http.service";

class InstituteService extends HttpServices {
    getAllInstitutes = async (params?: GetParams) => {
        try {
            const response = await this.getRequest({
                url: "/institutes",
                config: { params },
            });
            return response?.data;
        } catch (error) {
            console.error("Error fetching institutes from InstituteService:", error);
            throw error;
        }
    };

    getPublicProfile = async (username: string) => {
        try {
            const response = await this.getRequest({
                url: `/institute/${username}`,
            });
            return response?.data;
        } catch (error) {
            console.error("Error fetching institute profile from InstituteService:", error);
            throw error;
        }
    };

    getReviews = async (username: string, page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/institute/${username}/reviews`,
                config: { params: { page } },
            });
            return response?.data;
        } catch (error) {
            console.error("Error fetching institute reviews from InstituteService:", error);
            throw error;
        }
    };
}

const instituteService = new InstituteService();
export default instituteService;
