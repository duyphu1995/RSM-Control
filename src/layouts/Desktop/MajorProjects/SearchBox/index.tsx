import "react-datepicker/dist/react-datepicker.css";
import { Button, Input } from "antd";
import { searchPlaceHolderMajorProjects, searchPlaceHolderMajorProjectsJobsList } from "@/constants/strings";
import { SearchOutlined } from "@ant-design/icons";
import { DateRangeSelector } from "@/components/date_range_filter/DateRangeSelector";
import { IMajorProjectJobDetails, SearchBoxProps } from "@/types/majorProjects";
import { UIConfigModal } from "@/components/UIConfigModal";
import { useState } from "react";
import { ColumnType } from "antd/es/table";
import majorProjectService from "@/services/majorProjectsService";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/services/api";
import { useToast } from "@/components/common/toast/ToastProvider";
import { ToastType } from "@/components/common/toast/Toast";
import { useMajorProjectJobListStore } from "@/stores/majorProjectJobsListStore";
import { useShallow } from "zustand/shallow";

const SearchBox: React.FC<SearchBoxProps> = ({
  handleFilterData,
  searchInputValue,
  setSearchInputValue,
  isUiConfig,
  columnsUIConfig,
  selectedColumns
}) => {
  const [showUIConfigModal, setShowUIConfigModal] = useState(false);
  const { showToast } = useToast();

  const { setUIConfig } = useMajorProjectJobListStore(
    useShallow(state => ({
      setUIConfig: state.setUIConfig
    }))
  );

  const handleSaveUIConfig = (selectedColumns: ColumnType<IMajorProjectJobDetails>[]) => {
    updateUIConfigMutation.mutate({
      configType: "MajorProject_Job",
      columns: selectedColumns.map(col => String(col.key!)).filter(Boolean)
    });
    setShowUIConfigModal(false);
  };

  const updateUIConfigMutation = useMutation({
    mutationFn: majorProjectService.updateUiConfig,
    onSuccess: (data: any) => {
      setUIConfig(data.columns);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const initialColumns = selectedColumns.filter(col => col.key !== "action");

  return (
    <div className="h-5 w-full inline-flex justify-end items-start my-5 gap-3">
      <div className="flex-1">
        <Input
          placeholder={isUiConfig ? searchPlaceHolderMajorProjectsJobsList : searchPlaceHolderMajorProjects}
          prefix={<SearchOutlined />}
          style={{ height: "40px" }}
          value={searchInputValue}
          onChange={e => setSearchInputValue(e.target.value)}
          onPressEnter={() => {
            handleFilterData(false);
          }}
        />
      </div>
      {isUiConfig ? (
        <div>
          <Button
            onClick={() => setShowUIConfigModal(true)}
            className="!text-orange-600 !rounded-md !px-2 !py-1 !space-x-1 !border !border-gray-300 !cursor-pointer !font-semibold !inline-flex !justify-end !items-center"
            style={{ height: "40px" }}
          >
            UI Config
          </Button>
        </div>
      ) : (
        <div className="flex items-center px-2 py-1 space-x-1 border border-gray-300 rounded-md" style={{ height: "40px" }}>
          <DateRangeSelector handleFilterData={() => handleFilterData(true)} label="Last Activity Date" />
        </div>
      )}

      {/* Show UI Config */}
      {showUIConfigModal && (
        <UIConfigModal<IMajorProjectJobDetails>
          isShowUIConfigModal
          columns={columnsUIConfig}
          selectedColumns={initialColumns}
          onClose={() => setShowUIConfigModal(false)}
          onSave={handleSaveUIConfig}
        />
      )}
    </div>
  );
};

export default SearchBox;
