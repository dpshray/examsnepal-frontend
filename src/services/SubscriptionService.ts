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

  addSubscription = async (data: any) => {
    try {
      const response = await this.postRequest({
        url: "connectips/init-transaction",
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

  verifySubscription = async (data: any) => {
    try {
      const response = await this.postRequest({
        url: "verify-promo-code",
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

  transactionStatus = async (txnId: string) => {
    try {
      const response = await this.getRequest({
        url: `connectips/transaction-successfull/${txnId}`,
        config: { auth: true },
      });
      console.log("Service response:", response?.data);
      return response?.data; 
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  };

  
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
