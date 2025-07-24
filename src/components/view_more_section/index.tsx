import React, { useState, ReactNode } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ViewMoreSectionProps {
  children?: ReactNode;
}

const ViewMoreSection: React.FC<ViewMoreSectionProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className={`grid grid-cols-2 gap-y-3 text-sm pl-3 pr-3 transition-all duration-500`}>{expanded && children}</div>
      {/* Toggle Button */}
      {children && (
        <div className="flex justify-center py-3">
          <div
            className="mb-2 text-blue-600 text-sm font-normal focus:outline-none hover:underline cursor-pointer flex items-center gap-2"
            onClick={() => setExpanded(prev => !prev)}
          >
            <span>{expanded ? "View Less" : "View more"}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMoreSection;
