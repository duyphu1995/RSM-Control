import React from "react";
import { useFilterStore } from "@/stores/useFilterStore";
import { DropdownSelector } from "@/components/dropdown/DropDown";
import CommonButton from "@/components/common/button/CommonButton";
import { THEME } from "@/constants";

export const MobileFilterModal: React.FC<{
  handleFilterData: (filterType: string) => void;
  setSearchInputValue: (value: string) => void;
  setOptions: any;
  onClose: () => void; // Add close handler
}> = ({ handleFilterData, setSearchInputValue, setOptions, onClose }) => {
  const filters = useFilterStore(state => state.filters);
  const selected = useFilterStore(state => state.selected);
  const setSelected = useFilterStore(state => state.setSelected);
  const clearFilter = useFilterStore(state => state.clearFilter);

  const handleSelect = (key: string, selectedIds: string[]) => {
    const options = filters[key] || [];
    const selectedOptions = options.filter(option => selectedIds.includes(option.id));
    setSelected(key, selectedOptions);

    if (key === "company") {
      setSelected("projectNames", []);
      const allProjectNames = useFilterStore.getState().allProjectNames;

      let filteredProjectNames;

      if (selectedIds.length === 0) {
        filteredProjectNames = allProjectNames;
      } else {
        filteredProjectNames = allProjectNames.filter(project => selectedIds.includes(project.id));
      }

      setOptions("projectNames", filteredProjectNames);
    }
  };

  const handleClear = () => {
    clearFilter();
    Object.entries(filters).forEach(([key, options]) => {
      setSelected(key, options); // Select all options for each filter group
    });
    setSearchInputValue("");
    handleFilterData("clearFilter");
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-[400px] rounded-lg p-4 relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 text-xl close" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <div className="flex flex-col gap-3 mb-4">
          <DropdownSelector
            title="Project Name"
            options={filters["projectNames"]}
            selected={selected["projectNames"]?.map(opt => opt.id) || []}
            onSelect={ids => handleSelect("projectNames", ids)}
          />
          <DropdownSelector
            title="Order By"
            options={filters["orderBy"]}
            selected={selected["orderBy"]?.map(opt => opt.id) || []}
            onSelect={ids => handleSelect("orderBy", ids)}
          />
          <DropdownSelector
            title="Job Code"
            options={filters["jobCodes"]}
            selected={selected["jobCodes"]?.map(opt => opt.id) || []}
            onSelect={ids => handleSelect("jobCodes", ids)}
          />
          <DropdownSelector
            title="Status"
            options={filters["statuses"]}
            selected={selected["statuses"]?.map(opt => opt.id) || []}
            onSelect={ids => handleSelect("statuses", ids)}
            canSearch={false}
          />
          <DropdownSelector
            title="Pick-up/Delivery"
            options={filters["states"]}
            selected={selected["states"]?.map(opt => opt.id) || []}
            onSelect={ids => handleSelect("states", ids)}
            canSearch={false}
          />
        </div>

        <div className="flex justify-between">
          <CommonButton
            label="Clear"
            backgroundColor={THEME.COLORS.WHITE}
            className="text-gray-900 rounded-md border border-gray-300 w-[45%] h-10"
            onClick={handleClear}
          />
          <CommonButton
            label="Apply"
            backgroundColor={THEME.COLORS.PRIMARY}
            className="text-white rounded-md w-[45%] h-10"
            onClick={() => {
              handleFilterData("filter");
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
