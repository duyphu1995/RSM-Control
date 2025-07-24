import { useMutation } from "@tanstack/react-query";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { somethingWentWrong } from "@/constants/strings.ts";
import { commonService } from "@/services/commonService.ts";
import html2pdf from "html2pdf.js";

export const usePrintDeliveryDocketMutation = (showToast: any) => {
  return useMutation({
    mutationFn: commonService.printDeliveryDocket,
    onSuccess: (data: any, deliveryDocketNo: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");

      // Format Delivery Date
      const deliveryDateEl = doc.querySelector("#info .item .info-value");
      if (deliveryDateEl?.textContent?.trim()) {
        const deliveryDate = new Date(deliveryDateEl.textContent.trim());
        const formatted = `${deliveryDate.getDate().toString().padStart(2, "0")}/${(deliveryDate.getMonth() + 1)
          .toString()
          .padStart(
            2,
            "0"
          )}/${deliveryDate.getFullYear()} ${deliveryDate.getHours().toString().padStart(2, "0")}:${deliveryDate.getMinutes().toString().padStart(2, "0")}`;
        deliveryDateEl.textContent = formatted;
      }

      // Format all Scan Time
      const scanTimeCells = doc.querySelectorAll("#table3 tbody tr td:first-child");
      scanTimeCells.forEach(cell => {
        if (cell.textContent?.trim()) {
          const scanTimeDate = new Date(cell.textContent.trim());
          const formatted = `${scanTimeDate.getDate().toString().padStart(2, "0")}/${(scanTimeDate.getMonth() + 1)
            .toString()
            .padStart(
              2,
              "0"
            )}/${scanTimeDate.getFullYear()} ${scanTimeDate.getHours().toString().padStart(2, "0")}:${scanTimeDate.getMinutes().toString().padStart(2, "0")}`;
          cell.textContent = formatted;
        }
      });

      const updatedHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
      const blob = new Blob([updatedHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const isIOSPlatform = /iPad|iPhone/.test(navigator.userAgent);
      const isAndroidPlatform = /Android/.test(navigator.userAgent);
      if(isAndroidPlatform) {
          window.open(url, "_blank");
      } else {
        const deliveryDocketsPage = document.createElement("a");
        deliveryDocketsPage.href = url;
        deliveryDocketsPage.target = "_blank";
        deliveryDocketsPage.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    },
    onError: (_: any) => {
      showToast(ToastType.error, somethingWentWrong);
    }
  });
};
