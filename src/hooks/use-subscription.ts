import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import subscriptionService from "@/services/SubscriptionService";
import { PageParams } from "@/services/corporateExamServices";

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

export const useConnectIpsTransaction = () => {
  return useMutation({
    mutationFn: async ({
      subscription_type_id,
      promo_code,
    }: {
      subscription_type_id: number;
      promo_code: string;
    }) => {
      return await subscriptionService.connectIpsTransaction(
        subscription_type_id,
        promo_code,
      );
    },
    onError: () => {
      toast.error("Failed to add subscription");
    },
  });
};

export function useGetPaymentSettings(params?: PageParams) {
  return useQuery({
    queryKey: ["payment-settings", params],
    queryFn: () => subscriptionService.getPaymentSettings(params),
  });
}
