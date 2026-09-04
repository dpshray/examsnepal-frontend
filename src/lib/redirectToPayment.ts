import { redirectToConnectIPS } from "@/lib/connectIps";
import { redirectToEsewa } from "@/lib/redirectToEsewa";

export type PaymentMethod = "connectips" | "esewa";

export const redirectToPayment = (
  method: PaymentMethod,
  payment_url: string,
  payload: Record<string, any>,
) => {
  if (method === "esewa") {
    redirectToEsewa(payment_url, payload as any);
  } else {
    redirectToConnectIPS(payload);
  }
};
