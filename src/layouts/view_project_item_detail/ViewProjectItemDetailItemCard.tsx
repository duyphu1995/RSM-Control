import React from "react";
import { statusColors } from "@/utils/statusUtils.ts";
import { StatusId, stringEmDash, TIME_FORMAT } from "@/constants/app_constants.ts";
import {
  drawing,
  textDelivered,
  textDeliveredDate,
  textDeliveryDocket,
  textDescription,
  textJobCode,
  textJobLocation,
  textReady,
  textViewLess,
  textViewMore
} from "@/constants/strings.ts";
import { Images } from "@/constants/images.tsx";
import { THEME } from "@/constants";
import { Button } from "antd";
import { ProjectItemModel } from "@/stores/viewProjectItemDetailStore.ts";
import { DashedLine } from "@/components/dash_line/DashedLine";
import { formatTimeDayMonthYear } from "@/components/table-ant/table-common.ts";

interface ViewProjectItemDetailItemCardProps {
  item: ProjectItemModel;
  handlePrintDeliveryDocket: (item: string) => void;
}

export const ViewProjectItemDetailItemCard: React.FC<ViewProjectItemDetailItemCardProps> = ({ item, handlePrintDeliveryDocket }) => {
  const [isShowMore, setIsShowMore] = React.useState(false);

  return (
    <div className="border-1 rounded-md w-full ml-3 mr-3" style={{ borderColor: statusColors[item.status ?? StatusId.inProduction] }}>
      {/* Header */}
      <h3 className="font-semibold text-lg mb-2 text-gray-900 pt-3 pl-3 pr-3">{item.pieceNo}</h3>
      <div className="pl-3 pr-3">
        <DashedLine />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 text-sm mb-2 p-3 gap-x-3">
        <div className="w-full col-span-1">
          <div className="text-gray-700">{textReady}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.itemReadyQty}</div>
        </div>
        <div>
          <div className="text-gray-700">{textDelivered}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.itemDeliveredQty}</div>
        </div>
        <div>
          <div className="text-gray-700">{textDescription}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.description ? item.description : stringEmDash}</div>
        </div>
        <div>
          <div className="text-gray-700">{textJobCode}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.jobCodeAndPart}</div>
        </div>
        <div>
          <div className="text-gray-700">{drawing}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.drawingNumber ? item.drawingNumber : stringEmDash}</div>
        </div>
        <div>
          <div className="text-gray-700">{textJobLocation}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.jobLocation ? item.jobLocation : stringEmDash}</div>
        </div>
        {isShowMore && (
          <>
            <div>
              <div className="text-gray-700">{textDeliveredDate}</div>
              <div className="font-semibold text-sm text-gray-900 mt-[6px]">
                {item.itemDeliveredDate ? formatTimeDayMonthYear(item.itemDeliveredDate, TIME_FORMAT.ISO) : stringEmDash}
              </div>
            </div>
            <div>
              <div className="text-gray-700">{textDeliveryDocket}</div>
              {item.deliveryNumbers && item.deliveryNumbers.length > 0 ? (
                <div className="space-y-2 mt-[6px]">
                  {item.deliveryNumbers.map((singleItem, index) => (
                    <Button
                      key={index}
                      icon={<img src={Images.IconDownload} alt="download" />}
                      className="text-orange-600 rounded-md border border-gray-300 cursor-pointer inline-flex justify-end items-start"
                      style={{
                        height: "32px",
                        color: THEME.COLORS.PRIMARY
                      }}
                      onClick={() => handlePrintDeliveryDocket(singleItem)}
                    >
                      {singleItem}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="font-semibold text-sm text-gray-900 mt-[6px]">{stringEmDash}</div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="text-blue-600 text-sm mb-3 cursor-pointer" onClick={() => setIsShowMore(!isShowMore)}>
        {isShowMore ? (
          <div className="flex items-center gap-1 justify-center">
            {textViewLess} <img src={Images.IconViewLessMobile} alt="View less" />
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-center">
            {textViewMore} <img src={Images.IconViewMoreMobile} alt="View more" />
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="w-full">
        <div
          className="flex-1 text-white text-center py-2 rounded-br-md rounded-bl-md"
          style={{ backgroundColor: statusColors[item.status ?? StatusId.inProduction] }}
        >
          {item.status}
        </div>
      </div>
    </div>
  );
};
