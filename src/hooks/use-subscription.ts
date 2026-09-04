import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import subscriptionService from "@/services/SubscriptionService";

export const useEsewaTransaction = () => {
  return useMutation({
    mutationFn: async ({
      subscription_type_id,
      promo_code,
    }: {
      subscription_type_id: number;
      promo_code: string;
    }) => {
      return await subscriptionService.esewaTransaction(
        subscription_type_id,
        promo_code,
      );
    },
    onSuccess: () => {
      // t  oast.success("Redirecting to eSewa for payment...");
    },
    onError: () => {
      toast.error("Failed to add subscription");
    },
  });
};
