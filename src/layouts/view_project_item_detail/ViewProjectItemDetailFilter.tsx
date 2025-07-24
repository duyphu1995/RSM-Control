import React from "react";
import { Button, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  textApply,
  textClear,
  textDeliveryDocket,
  textDrawingNumber,
  textFilters,
  textJobCode,
  textJobLocation,
  textStatus
} from "@/constants/strings.ts";
import { THEME } from "@/constants";
import { DropdownSelector } from "@/components/dropdown/DropDown.tsx";
import { useShallow } from "zustand/shallow";
import { useViewProjectItemDetailStore } from "@/stores/viewProjectItemDetailStore.ts";

interface ViewProjectItemDetailItemFiltersProps {
  isVisible: boolean;
  onCancel: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ViewProjectItemDetailItemFiltersModal: React.FC<ViewProjectItemDetailItemFiltersProps> = ({
  isVisible,
  onCancel,
  onClearFilters,
  onApplyFilters
}) => {
  const {
    filters,
    selectedStatus,
    setSelectedStatus,
    selectedDeliveryDocket,
    setSelectedDeliveryDocket,
    selectedDrawingNumbers,
    setSelectedDrawingNumbers,
    selectedJobCodes,
    setSelectedJobCodes,
    selectedJobLocations,
    setSelectedJobLocations
  } = useViewProjectItemDetailStore(
    useShallow(state => ({
      filters: state.filters,
      selectedStatus: state.selectedStatus,
      setSelectedStatus: state.setSelectedStatus,
      selectedDeliveryDocket: state.selectedDeliveryDocket,
      setSelectedDeliveryDocket: state.setSelectedDeliveryDocket,
      selectedDrawingNumbers: state.selectedDrawingNumbers,
      setSelectedDrawingNumbers: state.setSelectedDrawingNumbers,
      selectedJobCodes: state.selectedJobCodes,
      setSelectedJobCodes: state.setSelectedJobCodes,
      selectedJobLocations: state.selectedJobLocations,
      setSelectedJobLocations: state.setSelectedJobLocations
    }))
  );

  const clearFilters = () => {
    onCancel();
    onClearFilters();
  };

  const applyFilters = () => {
    onCancel();
    onApplyFilters();
  };

  return (
    <Modal
      open={isVisible}
      title={<span className="text-lg font-semibold text-gray-900">{textFilters}</span>}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={clearFilters} style={{ height: "40px" }}>
          {textClear}
        </Button>,
        <Button key="apply" type="primary" onClick={applyFilters} style={{ backgroundColor: THEME.COLORS.PRIMARY, height: "40px" }}>
          {textApply}
        </Button>
      ]}
      styles={{
        body: {
          paddingTop: 24
        },
        footer: {
          paddingTop: 24
        }
      }}
      centered
      closeIcon={<CloseOutlined className="text-gray-700 cursor-pointer" />}
      width={400}
      wrapClassName="bottom-modal-wrapper"
      maskClosable={false}
    >
      <div>
        <div>
          <DropdownSelector title={textJobCode} options={filters.jobCodes} selected={selectedJobCodes} onSelect={setSelectedJobCodes} />
        </div>
        <div className="mt-3">
          <DropdownSelector
            title={textDrawingNumber}
            options={filters.drawingNumbers}
            selected={selectedDrawingNumbers}
            onSelect={setSelectedDrawingNumbers}
          />
        </div>
        <div className="mt-3">
          <DropdownSelector
            title={textJobLocation}
            options={filters.jobLocations}
            selected={selectedJobLocations}
            onSelect={setSelectedJobLocations}
          />
        </div>
        <div className="mt-3">
          <DropdownSelector title={textStatus} options={filters.statuses} selected={selectedStatus} onSelect={setSelectedStatus} canSearch={false} />
        </div>

        <div className="mt-3">
          <DropdownSelector
            title={textDeliveryDocket}
            options={filters.deliveryNumbers}
            selected={selectedDeliveryDocket}
            onSelect={setSelectedDeliveryDocket}
          />
        </div>
      </div>
    </Modal>
  );
};
