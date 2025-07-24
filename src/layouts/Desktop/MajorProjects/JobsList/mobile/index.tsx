import { formatTimeDayMonthYear, formatTimeWeekDayMonthYear } from "@/components/table-ant/table-common";
import ViewMoreSection from "@/components/view_more_section";
import { ROUTES } from "@/constants";
import { StatusId, stringEmDash } from "@/constants/app_constants";
import { Images } from "@/constants/images";
import { deliveryDocket, textDeliveredQty, textReadyQty, txtDrawing, txtDueDate, txtJobLocation, txtStartDate } from "@/constants/strings";
import { THEME } from "@/constants/theme";
import { MenuItem } from "@/stores/sidebarStore";
import { IMajorProjectJobDetails } from "@/types/majorProjects";
import { statusColors } from "@/utils/statusUtils";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface ViewJobsListDetailItemCard {
  item: IMajorProjectJobDetails;
  handlePrintDeliveryDocket: (item: string) => void;
}

const ViewJobsListDetailItemCard: React.FC<ViewJobsListDetailItemCard> = ({ item, handlePrintDeliveryDocket }) => {
  const isIOSPlatform = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  return (
    <div className="border-1 rounded-md mb-4 w-full ml-3 mr-3" style={{ borderColor: statusColors[item.status ?? StatusId.inProduction] }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 pt-3 pl-3 pr-3">{item.jobCodeAndPart}</h3>
        <Link
          to={ROUTES.VIEW_JOB_ITEM_DETAIL + `?tab=${MenuItem.majorlProject}`}
          state={{
            id: item.id,
            name: item.projectName,
            jobCodeAndPart: item.jobCodeAndPart,
            jobLocation: item.jobLocation,
            drawing: item.drawingNumber
          }}
          className="!text-orange-500 !font-semibold !text-sm !pr-4 !cursor-pointer"
        >
          View Jobs Items
        </Link>
      </div>
      <div className="pl-3 pr-3">
        <hr className="w-full border-t border-dashed border-gray-300 blur-sm" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 text-sm p-3">
        <div className="w-full col-span-1">
          <div className="text-gray-700">{txtStartDate}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{formatTimeDayMonthYear(item.importDate)}</div>
        </div>
        <div>
          <div className="text-gray-700">{txtDueDate}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{formatTimeWeekDayMonthYear(item.jobDueDate)}</div>
        </div>
        <div>
          <div className="text-gray-700">{txtJobLocation}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.jobLocation}</div>
        </div>
        <div>
          <div className="text-gray-700">{txtDrawing}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.drawingNumber}</div>
        </div>
      </div>
      <ViewMoreSection>
        <div>
          <div className="text-gray-700">{textReadyQty}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.jobReadyQty}</div>
        </div>
        <div>
          <div className="text-gray-700">{textDeliveredQty}</div>
          <div className="font-semibold text-sm text-gray-900 mt-[6px]">{item.jobDeliveredQty}</div>
        </div>
        <div>
          <div className="text-gray-700">{deliveryDocket}</div>
          {item.deliveryNumbers && item.deliveryNumbers.length > 0 ? (
            <div className="inline-flex flex-col gap-2">
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
      </ViewMoreSection>

      {/* Footer Buttons */}
      <div className="w-full flex">
        <div className="flex-1 font-semibold text-black text-center py-2 rounded-bl-md bg-gray-200 ">{item.state}</div>
        <div
          className="flex-1 text-white text-center py-2 rounded-br-md"
          style={{ backgroundColor: statusColors[item.status ?? StatusId.inProduction] }}
        >
          {item.status}
        </div>
      </div>
    </div>
  );
};

export default ViewJobsListDetailItemCard;
