import React from "react";
import { Button, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { textApply, textClear, textCompany, textFilters, textProjectName } from "@/constants/strings.ts";
import { THEME } from "@/constants";
import { DropdownSelector } from "@/components/dropdown/DropDown.tsx";
import { useShallow } from "zustand/shallow";
import { useMajorProjectStore } from "@/stores/majorProjectStore.ts";

interface MajorProjectFilterProps {
  isVisible: boolean;
  onCancel: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const MajorProjectFilter: React.FC<MajorProjectFilterProps> = ({ isVisible, onCancel, onClearFilters, onApplyFilters }) => {
  const { filters, tempFilters, companyId__in, setCompanyIdIn, id__in, setIdIn, setTempFilters } = useMajorProjectStore(
    useShallow(state => ({
      filters: state.filters,
      tempFilters: state.tempFilters,
      setTempFilters: state.setTempFilters,
      companyId__in: state.companyId__in,
      setCompanyIdIn: state.setCompanyIdIn,
      id__in: state.id__in,
      setIdIn: state.setIdIn
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

  const handleSelect = (selectedIds: string[]) => {
    const allProjectNames = filters.projectNames || [];

    let filteredProjectNames;

    if (selectedIds.length === 0) {
      filteredProjectNames = allProjectNames;
    } else {
      filteredProjectNames = allProjectNames.filter(project => selectedIds.includes(project.companyId ?? ""));
    }
    setTempFilters({
      companies: filters.companies,
      projectNames: filteredProjectNames
    });
    setCompanyIdIn(selectedIds);
    setIdIn(filteredProjectNames.map(project => project.id));
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
          <DropdownSelector title={textCompany} options={filters.companies} selected={companyId__in} onSelect={ids => handleSelect(ids)} />
        </div>

        <div className="mt-3">
          <DropdownSelector title={textProjectName} options={tempFilters.projectNames} selected={id__in} onSelect={setIdIn} />
        </div>
      </div>
    </Modal>
  );
};
