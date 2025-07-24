import { service } from "@/services/api.ts";

export const commonService = {
  printDeliveryDocket: (params: string) => service.post(`deliveryDockets/print-by-delivery-no/${params}`, {})
};
