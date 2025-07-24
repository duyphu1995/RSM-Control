import React, { useState } from "react";
import { Images } from "@/constants/images";
import IconExportCSV from "@/assets/icon-export-csv.svg";
import { TIME_FORMAT, stringEmDash } from "@/constants/app_constants.ts";
import dayjs from "dayjs";
import BreakLine from "@/components/common/break_line";

interface CardData {
  sketchJobId: string;
  sketchProjectName: string;
  orderDate: string;
  dueDate: string;
  orderBy: string;
  poNumber: string;
  qcDate: string;
  completedDate: string;
  state: string;
  status: string;
  drawingLink: string;
}

interface CardProps {
  data: CardData;
}

export const CardItem: React.FC<CardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    "In Production": "#06B6D4",
    Ready: "#D19500",
    Cancelled: "#83664B",
    Delivered: "#22C55E",
    Exception: "#DC2626",
    "Required Booking": "#EC4899",
    "On Hold": "#A855F7",
    "Delivery Booked": "#3B82F6"
  };

  return (
    <div
      className={`relative overflow-hidden border-2 rounded-lg p-4 mb-4 transition-all duration-300 cursor-pointer`}
      style={{ borderColor: statusColors[data.status] || "#ccc" }}
    >
      {/* Header */}
      <h3 className="font-bold text-lg mb-2">{data.sketchJobId}</h3>
      <BreakLine />

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-2 text-sm mb-2">
        <div className="w-full col-span-2">
          <div className="text-gray-500">Project</div>
          <div className={`font-semibold ${data.sketchProjectName ? "" : "text-gray-400"}`}>{data.sketchProjectName || stringEmDash}</div>
        </div>
        <div>
          <div className="text-gray-500">Order Date</div>
          <div className={`font-semibold ${data.orderDate ? "" : "text-gray-400"}`}>
            {dayjs(data.orderDate).format(TIME_FORMAT.VN_DATE) || stringEmDash}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Due Date</div>
          <div className={`font-semibold ${data.dueDate ? "" : "text-gray-400"}`}>
            {data.dueDate ? dayjs(data.dueDate).format(TIME_FORMAT.VN_DATE) : stringEmDash}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Order by</div>
          <div className={`font-semibold ${data.orderBy ? "" : "text-gray-400"}`}>{data.orderBy || stringEmDash}</div>
        </div>
        <div>
          <div className="text-gray-500">PO Number</div>
          <div className={`font-semibold ${data.poNumber ? "" : "text-gray-400"}`}>{data.poNumber || stringEmDash}</div>
        </div>
        {isExpanded && (
          <>
            <div>
              <div className="text-gray-500">Ready Date</div>
              <div className={`font-semibold ${data.poNumber ? "" : "text-gray-400"}`}>{data.poNumber || stringEmDash}</div>
            </div>
            <div>
              <div className="text-gray-500">Delivered Date</div>
              <div className={`font-semibold ${data.completedDate ? "" : "text-gray-400"}`}>
                {data.completedDate ? dayjs(data.completedDate).format(TIME_FORMAT.VN_DATE) : stringEmDash}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Drawing</div>
              <div className={`font-semibold ${data.orderDate ? "" : "text-gray-400"}`}>
                {data.drawingLink ? (
                  <a
                    href={data.drawingLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download text-orange-600 px-3 py-1.5 rounded-md border border-gray-300 inline-flex justify-center items-center"
                  >
                    <img src={IconExportCSV} className="mr-2" alt="download" />
                    Download
                  </a>
                ) : (
                  stringEmDash
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* View More Toggle */}
      <div className="text-blue-600 text-sm mb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <div className="flex items-center gap-1 justify-center">
            View less <img src={Images.IconViewLessMobile} alt="View less" />
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-center">
            View more <img src={Images.IconViewMoreMobile} alt="View more" />
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex -mx-4 -mb-4">
        <div className="flex-1 bg-gray-200 text-center py-2">{data.state}</div>
        <div className="flex-1 text-white text-center py-2" style={{ backgroundColor: statusColors[data.status] || "#3CD856" }}>
          {data.status}
        </div>
      </div>
    </div>
  );
};
