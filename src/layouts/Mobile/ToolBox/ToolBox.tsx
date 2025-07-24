import "react-datepicker/dist/react-datepicker.css";
import { Input } from "antd";
import { searchPlaceHolder } from "@/constants/strings";
import { SearchOutlined } from "@ant-design/icons";
import { DateRangeSelector } from "./DateRangeSelector";
import { Images } from "@/constants/images";

interface ToolBoxProps {
  handleFilterData: (filterType?: string) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  setShowUIFilterModal?: any;
}

export const FilterToolBox: React.FC<ToolBoxProps> = ({ handleFilterData, searchInputValue, setSearchInputValue, setShowUIFilterModal }) => {
  return (
    <div className="w-full d-flex flex-row justify-end items-start my-5 gap-3">
      <div className="flex items-center mb-3 px-2 py-1 space-x-1 border border-gray-300 rounded-md" style={{ height: "40px" }}>
        <DateRangeSelector handleFilterData={handleFilterData} />
      </div>

      <div className="flex">
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
        <div className="flex items-center ml-3 py-1 space-x-2 border border-gray-300 rounded-md" style={{ height: "40px" }}>
          <button onClick={() => setShowUIFilterModal(true)} className="text-orange-600 px-3 py-1 cursor-pointer w-[40px]">
            <img title="UI Config" src={Images.IconFilterMobile} />
          </button>
        </div>
      </div>
    </div>
  );
};
