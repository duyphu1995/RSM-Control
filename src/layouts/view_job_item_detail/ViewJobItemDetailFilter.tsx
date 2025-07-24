import React from "react";
import { Button, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { textApply, textClear, textDeliveryDocket, textFilters, textStatus } from "@/constants/strings.ts";
import { DropdownSelector } from "@/components/dropdown/DropDown.tsx";
import { useViewJobItemDetailStore } from "@/stores/viewJobItemDetailStore.ts";
import { useShallow } from "zustand/shallow";
import { THEME } from "@/constants";

interface ViewJobItemDetailItemFiltersProps {
  isVisible: boolean;
  onCancel: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ViewJobItemDetailItemFiltersModal: React.FC<ViewJobItemDetailItemFiltersProps> = ({
  isVisible,
  onCancel,
  onClearFilters,
  onApplyFilters
}) => {
  const { filters, selectedStatus, setSelectedStatus, selectedDeliveryDocket, setSelectedDeliveryDocket } = useViewJobItemDetailStore(
    useShallow(state => ({
      filters: state.filters,
      selectedStatus: state.selectedStatus,
      setSelectedStatus: state.setSelectedStatus,
      selectedDeliveryDocket: state.selectedDeliveryDocket,
      setSelectedDeliveryDocket: state.setSelectedDeliveryDocket
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
