import "react-datepicker/dist/react-datepicker.css";
import { DropdownSelector } from "@/components/dropdown/DropDown";
import { Button } from "antd";
import { IMajorProjectsFilter } from "@/types/majorProjects";
import React from "react";
import { textCompany, textProjectName } from "@/constants/strings.ts";

const FilterMajorProjects: React.FC<IMajorProjectsFilter> = ({
  handleFilterData,
  filters,
  tempFilters,
  selectedCompany,
  setSelectedCompany,
  selectedProject,
  setSelectedProject,
  setTempFilters,
  setSearchInputValue
}) => {
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
    setSelectedCompany(selectedIds);
    setSelectedProject(filteredProjectNames.map(project => project.id));
  };
  return (
    <div className="wrapper w-full inline-flex my-5 gap-3 bg-[#FAFAFA] rounded-md border border-gray-200">
      <div className="content=wrapper w-full m-3 z-50">
        <div className="first-line-filter flex gap-3 grid grid-cols-3">
          <div className="flex-1/3">
            <DropdownSelector title={textCompany} options={filters.companies} selected={selectedCompany} onSelect={ids => handleSelect(ids)} />
          </div>
          <div className="flex-1/3">
            <DropdownSelector title={textProjectName} options={tempFilters.projectNames} selected={selectedProject} onSelect={setSelectedProject} />
          </div>
          <div className="button-combination flex-1/5">
            <div className="w-1/2 flex gap-2 items-center h-full">
              <Button
                className="!text-gray-900 !flex-1/2 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                onClick={() => {
                  const companyOptions: string[] = filters.companies?.map(company => company.id) || [];
                  const projectOptions: string[] = filters.projectNames?.map(project => project.id) || [];
                  setSelectedCompany(companyOptions);
                  setSelectedProject(projectOptions);
                  setTempFilters({
                    companies: filters.companies,
                    projectNames: filters.projectNames
                  });
                  setSearchInputValue("");
                  handleFilterData();
                }}
              >
                Clear
              </Button>
              <Button
                className="!text-orange-600 !flex-1/2 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                onClick={() => handleFilterData()}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMajorProjects;
