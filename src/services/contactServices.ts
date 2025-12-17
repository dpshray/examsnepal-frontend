import HttpServices from "./ExamService/http.service";

class ContactService extends HttpServices {
    // Send contact message
    sendContactMessage = async (data: any) => {
        try {
            const response = await this.postRequest({
                url: "/contact",
                data,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    };
}

const contactService = new ContactService();
export default contactService;