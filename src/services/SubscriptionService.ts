import HttpServices from "@/services/ExamService/http.service";

class SubscriptionService extends HttpServices {
  // Get all subscription types
  getSubscriptionTypes = async () => {
    try {
      const response = await this.getRequest({
        url: "subscription-type",
        config: {
          auth: true, 
        },
      });
      return response?.data?.data; 
    } catch (error) {
      throw error;
    }
  };

  // Get logged-in user subscription status
  getUserSubscriptionStatus = async () => {
    try {
      const response = await this.getRequest({
        url: "user-subscription-status",
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

const subscriptionService = new SubscriptionService();
export default subscriptionService;
