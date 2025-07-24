import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SortIconProps {
  sortOrder: string | null;
}

export const SortIcon: React.FC<SortIconProps> = ({ sortOrder }) => {
  return (
    <div className="flex flex-col leading-none space-y-[-6px] items-center">
      <ChevronUp size={14} color={sortOrder === "ascend" ? "#595959" : "#bfbfbf"} />
      <ChevronDown size={14} color={sortOrder === "descend" ? "#595959" : "#bfbfbf"} />
    </div>
  );
};
