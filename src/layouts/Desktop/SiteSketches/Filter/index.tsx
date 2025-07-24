import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useFilterStore } from "@/stores/useFilterStore";
import { DropdownSelector } from "@/components/dropdown/DropDown";
import { Button } from "antd";
import { textApply, textClear } from "@/constants/strings";

export const Filter: React.FC<{
  handleFilterData: (filterType: string) => void;
  setSearchInputValue: (value: string) => void;
  setOptions: any;
}> = ({ handleFilterData, setSearchInputValue, setOptions }) => {
  const filters = useFilterStore(state => state.filters);
  const selected = useFilterStore(state => state.selected);
  const setSelected = useFilterStore(state => state.setSelected);
  const clearFilter = useFilterStore(state => state.clearFilter);

  const handleSelect = (key: string, selectedIds: string[]) => {
    const options = filters[key] || [];
    const selectedOptions = options.filter(option => selectedIds.includes(option.id));
    setSelected(key, selectedOptions);
    if (key === "companies") {
      const allProjectNames = useFilterStore.getState().allProjectNames; // Get all project names
      let filteredProjectNames;
      if (selectedIds.length === 0) {
        // If no company selected → Show all project names unselected
        return setSelected("projectNames", []);
      } else {
        // Filter project names based on selected company IDs
        filteredProjectNames = allProjectNames.filter(
          project => project.companyId && selectedIds.includes(project.companyId) // Project.companyId === company.id relationship
        );
        // Update project names dropdown
        setOptions("projectNames", allProjectNames);
        setSelected("projectNames", filteredProjectNames);
      }
    }

    if (key === "projectNames") {
      const listCompanies = filters["companies"];
      let filteredCompanies;

      if (selectedOptions.length === 0) {
        // If uncheck all projects, also uncheck all companies
        setSelected("companies", []);
      } else {
        // Extract companyIds from selectedOptions (projectNames)
        const selectedCompanyIds = selectedOptions.map(project => project.companyId).filter(Boolean);
        // Filter companies that match those companyIds
        filteredCompanies = listCompanies.filter(company => selectedCompanyIds.includes(company.id));
        // Set selected companies base on selected projectNames
        setSelected("companies", filteredCompanies);
      }
    }
  };

  const handleClear = () => {
    clearFilter(); // ✅ Clear all selections
    Object.entries(filters).forEach(([key, options]) => {
      setSelected(key, options); // Select all options for each filter group
    });
    setSearchInputValue("");
    handleFilterData("clearFilter");
  };

  return (
    <div className="wrapper w-full inline-flex my-2 gap-3">
      <div className="content-wrapper w-full m-3 z-50 min-w-0">
        <div className="first-line-filter flex gap-3 mb-2">
          <div className="flex-1/4 min-w-0">
            <DropdownSelector
              title="Company"
              options={filters["companies"]}
              selected={selected["companies"]?.map(opt => opt.id) || []}
              onSelect={ids => handleSelect("companies", ids)}
            />
          </div>
          <div className="flex-2/4 min-w-0">
            <DropdownSelector
              title="Project Name"
              options={filters["projectNames"]}
              selected={selected["projectNames"]?.map(opt => opt.id) || []}
              onSelect={ids => handleSelect("projectNames", ids)}
            />
          </div>
          <div className="flex-1/4 min-w-0">
            <DropdownSelector
              title="Order by"
              options={filters["orderBy"]}
              selected={selected["orderBy"]?.map(opt => opt.id) || []}
              onSelect={ids => handleSelect("orderBy", ids)}
            />
          </div>
        </div>
        <div className="2nd-line-filter flex gap-3">
          <div className="flex-1/4 min-w-0">
            <DropdownSelector
              title="Job Code"
              options={filters["jobCodes"]}
              selected={selected["jobCodes"]?.map(opt => opt.id) || []}
              onSelect={ids => handleSelect("jobCodes", ids)}
            />
          </div>

          <div className="flex-2/4 min-w-0">
            <div className="flex gap-3">
              <div className="flex-1/4 min-w-0">
                <DropdownSelector
                  title="Status"
                  options={filters["statuses"]}
                  selected={selected["statuses"]?.map(opt => opt.id) || []}
                  onSelect={ids => handleSelect("statuses", ids)}
                  canSearch={false}
                />
              </div>
              <div className="flex-1/4 min-w-0">
                <DropdownSelector
                  title="Pick-up/Delivery"
                  options={filters["states"]}
                  selected={selected["states"]?.map(opt => opt.id) || []}
                  onSelect={ids => handleSelect("states", ids)}
                  canSearch={false}
                />
              </div>
            </div>
          </div>

          <div className="button-combination flex-1/4">
            <div className="w-1/2 flex gap-2 items-center h-full">
              <Button className="!text-gray-900 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold" onClick={handleClear}>
                {textClear}
              </Button>
              <Button
                className="!text-orange-600 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                onClick={() => handleFilterData("filter")}
              >
                {textApply}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
