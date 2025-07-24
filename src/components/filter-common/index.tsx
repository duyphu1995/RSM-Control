import { Dropdown, Button, Space, Flex, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { IApplyFilter, IMajorProjectsJobsListFilter, IOptionsFilter } from "@/types/majorProjects";
import { THEME } from "@/constants";
import { DownOutlined } from "@ant-design/icons";
import { filterTitles } from "@/constants/strings";

interface FilterCommonProps {
  filterData?: IMajorProjectsJobsListFilter;
  onFilterChange: (filterKey: keyof IApplyFilter, selectedIds: string[]) => void;
  onClear: () => void;
  onApply: () => void;
}

const FilterCommon: React.FC<FilterCommonProps> = ({ filterData, onFilterChange, onClear, onApply }) => {
  const [selectedKeys, setSelectedKeys] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (filterData) {
      const initial: Record<string, string[]> = {};
      Object.entries(filterData).forEach(([key, options]) => {
        initial[key] = (options as IOptionsFilter[]).map(opt => opt.id);
      });
      setSelectedKeys(initial);
    }
  }, [filterData]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSelect = (filterKey: string, key: string) => {
    const prev = selectedKeys[filterKey] || [];
    let next: string[] = [];

    if (key === "all") {
      const allOptionIds = (filterData?.[filterKey as keyof IMajorProjectsJobsListFilter] as unknown as IOptionsFilter[]).map(opt => opt.id);
      next = prev.length === allOptionIds.length ? [] : allOptionIds;
    } else {
      const newSelection = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      next = newSelection;
    }

    setSelectedKeys({ ...selectedKeys, [filterKey]: next });
    onFilterChange(filterKey as keyof IApplyFilter, next);
  };

  const renderFilterDropdowns = () => {
    if (!filterData) return null;

    return Object.entries(filterData).map(([filterKey, options]) => {
      const isOpen = openDropdown === filterKey;
      const handleOpenChange = (flag: boolean) => {
        setOpenDropdown(flag ? filterKey : null);
      };

      const overlay = (
        <div
          className="!h-full !w-full !text-base !items-center !justify-between !px-4 !py-2 !text-left !border !border-gray-300 !rounded-md !shadow-sm !bg-white !hover:bg-gray-50"
          style={{
            maxHeight: 300,
            overflowY: "auto",
            padding: "8px"
          }}
        >
          <label className="hover:bg-orange-50 cursor-pointer bg-white py-3 flex items-center px-4 py-2 gap-2" key="all">
            <Checkbox
              checked={selectedKeys[filterKey]?.length === (options as IOptionsFilter[]).length}
              onChange={() => handleSelect(filterKey, "all")}
            >
              <span className="font-medium text-gray-900">All</span>
            </Checkbox>
          </label>
          {(options as IOptionsFilter[]).map(option => (
            <label className="hover:bg-orange-50 cursor-pointer bg-white py-3 flex items-center px-4 py-2 gap-2" key={option.id}>
              <Checkbox checked={selectedKeys[filterKey]?.includes(option.id)} onChange={() => handleSelect(filterKey, option.id)}>
                <span className="text-gray-800">{option.displayName}</span>
              </Checkbox>
            </label>
          ))}
        </div>
      );

      return (
        <Dropdown
          key={filterKey}
          trigger={["click"]}
          open={isOpen}
          onOpenChange={handleOpenChange}
          popupRender={() => overlay}
          className="!h-full !w-full !text-base !items-center !justify-between !px-4 !py-2 !text-left !border !border-gray-300 !rounded-md !shadow-sm !bg-white !hover:bg-gray-50"
        >
          <Button>
            <span className="font-normal text-gray-900 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
              <span className="font-semibold text-gray-700">{filterTitles.find(title => title.key === filterKey)?.name || filterKey}</span>:{" "}
              {selectedKeys[filterKey]?.length === (options as IOptionsFilter[]).length
                ? "All"
                : selectedKeys[filterKey]
                    ?.map(k => (options as IOptionsFilter[]).find(o => o.id === k)?.displayName)
                    .filter(Boolean)
                    .join(", ") || ""}
            </span>
            <Space>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      );
    });
  };

  return (
    <div className="wrapper w-full inline-flex my-5 gap-3 bg-gray-50 rounded-md">
      <div className="content-wrapper w-full m-3 z-50">
        <div className="first-line-filter grid grid-cols-3 gap-4 mb-4">
          {renderFilterDropdowns()}
          <Flex className="grid-cols-5" justify="left" gap={10}>
            <Button
              onClick={onClear}
              style={{
                borderColor: THEME.COLORS.SECONDARY,
                color: THEME.COLORS.DARK,
                height: "40px"
              }}
              className="!text-gray-900 !rounded-md !border !border-gray-300 !cursor-pointer !font-semibold !text-base"
            >
              Clear
            </Button>
            <Button
              onClick={onApply}
              className="!text-orange-600 !rounded-md !border !border-gray-300 !cursor-pointer !font-semibold !text-base"
              style={{
                height: "40px",
                color: THEME.COLORS.PRIMARY
              }}
            >
              Apply
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default FilterCommon;
