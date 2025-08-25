import HttpService from "@/services/ExamService/http.service";

class PinsService extends HttpService {

    getAllPins = async (page: number = 1) => {
        try {
            const response = await this.getRequest({

                url: `bookmarks?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            console.error('Error fetching all pins from PinsService:', error);
            throw error;
        }
    }
    getMyPins = async (page: number = 1) => {
        try {
            const response = await this.getRequest({
                url: `/bookmarks/allmy/?page=${page}`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            console.error('Error fetching my pins from PinsService:', error);
            throw error;
        }
    }
    deletePin = async (pinId: number) => {
        try {
            const response = await this.deleteRequest({
                url: `/bookmarks/${pinId}/`,
                config: {
                    auth: true,
                },
            });
            return response?.data;
        } catch (error) {
            console.error('Error unpinning pin from PinsService:', error);
            throw error;
        }
    }
}

const pinsService = new PinsService();
export default pinsService