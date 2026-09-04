import { toast } from "sonner";

type EsewaPayload = {
  amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number | string;
  product_delivery_charge: number | string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
};

export const redirectToEsewa = (payment_url: string, payload: EsewaPayload) => {
  if (!payment_url || !payload?.signature) {
    console.error("Invalid eSewa payment data:", { payment_url, payload });
    toast.error("Invalid payment data received");
    return;
  }

  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") {
      toast.error(`Missing value for ${k}`);
    }
  });

  const form = document.createElement("form");
  form.method = "POST";
  form.action = payment_url;
  form.target = "_blank";
  form.style.display = "none";

  Object.entries(payload).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value ?? "");
    form.appendChild(input);
  });

  //   console.log("Submitting eSewa form with:", payload);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
