import "react-datepicker/dist/react-datepicker.css";
import { Button, Input } from "antd";
import { searchPlaceHolder } from "@/constants/strings";
import { SearchOutlined } from "@ant-design/icons";
import { DateRangeSelector } from "@/components/date_range_filter/DateRangeSelector";
import { textUIConfig } from "@/constants/strings";

interface ToolBoxProps {
  handleFilterData: (filterType?: string) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  setShowUIConfigModal: any;
}

export const ToolBox: React.FC<ToolBoxProps> = ({ handleFilterData, searchInputValue, setSearchInputValue, setShowUIConfigModal }) => {
  return (
    <div className="h-5 w-full inline-flex justify-end items-start my-5 gap-3">
      <div className="flex-1">
        <Input
          placeholder={searchPlaceHolder}
          prefix={<SearchOutlined />}
          style={{ height: "40px" }}
          value={searchInputValue}
          onChange={e => setSearchInputValue(e.target.value)}
          onPressEnter={() => {
            handleFilterData("filter");
          }}
        />
      </div>
      <div className="flex items-center px-2 py-1 space-x-1 border border-gray-300 rounded-md" style={{ height: "40px" }}>
        <DateRangeSelector handleFilterData={handleFilterData} />
      </div>
      <Button
        onClick={() => setShowUIConfigModal(true)}
        className="!text-orange-600 !rounded-md !px-2 !py-1 !space-x-1 !border !border-gray-300 !cursor-pointer !font-semibold !inline-flex !justify-end !items-center"
        style={{ height: "40px" }}
      >
        {textUIConfig}
      </Button>
    </div>
  );
};
