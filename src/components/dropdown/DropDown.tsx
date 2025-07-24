import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Check, Minus } from "lucide-react";

// Custom CheckboxItem
const CheckboxItem = ({
  label,
  isChecked,
  onChange,
  isAll = false,
  partiallyChecked = false
}: {
  label: string;
  isChecked: boolean;
  onChange: () => void;
  isAll?: boolean;
  partiallyChecked?: boolean;
}) => {
  return (
    <div className="flex items-center mb-2 cursor-pointer select-none" onClick={onChange}>
      <div className="w-5 h-5 flex items-center justify-center border-2 border-orange-500 rounded-md bg-white">
        {isAll && (isChecked || partiallyChecked) && (
          <div className="bg-orange-500 w-full h-full flex items-center justify-center text-white">
            {isChecked ? <Check size={14} /> : <Minus size={14} />}
          </div>
        )}

        {!isAll && isChecked && (
          <div className="bg-orange-500 w-full h-full flex items-center justify-center text-white">
            <Check size={14} />
          </div>
        )}
      </div>
      <span className="ml-2 text-sm text-gray-900">{label}</span>
    </div>
  );
};

interface FilterOption {
  id: string;
  displayName: string;
  companyId?: string;
}

interface DropdownSelectorProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onSelect: (value: string[]) => void;
  canSearch?: boolean;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({ title, options, selected, onSelect, canSearch = true }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modify to search with any character input
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/gi, " ");
  const filteredOptions = useMemo(() => {
    const searchTokens = normalize(search).split(/\s+/).filter(Boolean);

    return options?.filter(opt => {
      const target = normalize(opt.displayName || "");
      return searchTokens.every(token => target.includes(token));
    });
  }, [search, options]);

  const isAllSelected = useMemo(() => {
    return filteredOptions?.length >= 0 && filteredOptions?.every(opt => selected.includes(opt.id));
  }, [filteredOptions, selected]);

  const isPartiallySelected = useMemo(() => {
    return !isAllSelected && filteredOptions?.some(opt => selected.includes(opt.id));
  }, [filteredOptions, selected, isAllSelected]);

  useEffect(() => {
    setSearch("");
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleOption = (id: string) => {
    const newSelected = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    onSelect(newSelected);
  };

  const handleToggleAll = () => {
    if (isAllSelected) {
      const newSelected = selected.filter(id => !filteredOptions?.some(opt => opt.id === id));
      onSelect(newSelected);
    } else {
      const newSelected = Array.from(new Set([...selected, ...(filteredOptions ?? []).map(opt => opt.id)]));
      onSelect(newSelected);
    }
  };

  return (
    <div ref={dropdownRef} className="w-full relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 h-10"
      >
        <div className="flex-1 min-w-0">
          <span className="block font-normal text-gray-900 truncate whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="font-semibold text-gray-900">{title}</span>:{" "}
            {selected.length === options?.length
              ? "All"
              : options
                  ?.filter(opt => selected.includes(opt.id))
                  .map(opt => opt.displayName)
                  .join(", ")}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {canSearch && (
            <div className="p-2 sticky top-0 bg-white">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          )}

          {/* Custom CheckboxItem for "All" */}
          {filteredOptions.length > 0 && (
            <>
              <div className="px-4 py-2 hover:bg-orange-50">
                <CheckboxItem label="All" isChecked={isAllSelected} partiallyChecked={isPartiallySelected} onChange={handleToggleAll} isAll={true} />
              </div>

              {filteredOptions.map(opt => (
                <div key={opt.id} className="px-4 py-2 hover:bg-orange-50">
                  <CheckboxItem label={opt.displayName} isChecked={selected.includes(opt.id)} onChange={() => toggleOption(opt.id)} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
