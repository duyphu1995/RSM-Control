import React, { useState, useMemo } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/stores/useSketchStore";
import { Minus, Check } from "lucide-react";
import { Images } from "@/constants/images";

type SortableItemProps = {
  id: string;
  name: string;
  onRemove: (id: string) => void;
};

const SortableItem: React.FC<SortableItemProps> = ({ id, name, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes} // Keep attributes here (for keyboard focus)
      className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-1"
    >
      <div className="flex items-center">
        {/* Apply listeners ONLY to the drag handle */}
        <img src={Images.IconDragAndDrop} {...listeners} className="cursor-move" />
        <span className="ml-2 text-gray-900">{name}</span>
      </div>

      {/* This button will now fire normally */}
      <button onClick={() => onRemove(id)} className="text-gray-500 close cursor-pointer">
        ✕
      </button>
    </div>
  );
};

type UIConfigModalProps = {
  columns: ColumnDef<Job>[];
  selectedColumns: ColumnDef<Job>[];
  onClose: () => void;
  onSave: (selected: ColumnDef<Job>[]) => void;
};

export const UIConfigModal: React.FC<UIConfigModalProps> = ({ columns, selectedColumns, onClose, onSave }) => {
  const [availableColumns] = useState(columns);
  const [selected, setSelected] = useState(selectedColumns);

  const [search, setSearch] = useState("");

  const filteredColumns = useMemo(() => {
    return availableColumns.filter(col => String(col.header).toLowerCase().includes(search.toLowerCase()));
  }, [search, availableColumns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelected(prev => {
        return arrayMove(
          [...prev],
          prev.findIndex(c => c.id === active.id),
          prev.findIndex(c => c.id === over.id)
        );
      });
    }
  };

  const toggleColumn = (id: string) => {
    if (!id) return; // safety check
    setSelected(prev => {
      const exists = prev.some(col => col.id === id);
      if (exists) {
        return prev.filter(col => col.id !== id);
      }
      const colToAdd = availableColumns.find(col => col.id === id);
      return colToAdd ? [...prev, colToAdd] : prev;
    });
  };

  const handleRemove = (id: string) => {
    setSelected(selected.filter(col => col.id !== id));
  };

  const allChecked = selected.length === availableColumns.length;
  const partiallyChecked = selected.length > 0 && selected.length < availableColumns.length;
  const CheckboxItem = ({
    label,
    isChecked,
    onChange,
    isAll = false
  }: {
    label: string;
    isChecked: boolean;
    onChange: () => void;
    isAll?: boolean;
  }) => {
    return (
      <div className="flex items-center mb-4 cursor-pointer select-none" onClick={onChange}>
        <div className="w-5 h-5 flex items-center justify-center border-2 border-orange-500 rounded-md bg-white">
          {/* If it's 'All' checkbox → Show dynamic icon */}
          {isAll && (allChecked || partiallyChecked) && (
            <div className="bg-orange-500 w-full h-full flex items-center justify-center  text-white">
              {allChecked ? <Check size={14} /> : <Minus size={14} />}
            </div>
          )}

          {/* If it's individual checkbox → Show Check icon when selected */}
          {!isAll && isChecked && (
            <div className="bg-orange-500 w-full h-full flex items-center justify-center  text-white">
              <Check size={14} />
            </div>
          )}
        </div>
        <span className="ml-2 text-sm text-gray-900">{label}</span>
      </div>
    );
  };

  return (
    <div className="ui-config-modal fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[700px] p-4 ui-config-container">
        <h2 className="-mx-4 px-4 text-lg font-semibold mb-4 border-gray-300 border-b pb-2">
          UI Config
          <button onClick={onClose} className="text-gray-500 close cursor-pointer float-end">
            ✕
          </button>
        </h2>

        <div className="flex gap-4">
          {/* Left side: Column options */}
          <div className="w-1/2">
            <div className="column-selected-config-sketch">
              <div className="ui-config-search-input">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border-gray-300 border rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ui-config-column-2-sketch">
              <div className="ui-config-column-sketch">
                {/* ✅ Filtered Columns List */}
                <div className="ui-config-scrollbar max-h-[300px] overflow-y-auto">
                  <CheckboxItem
                    label="All fields"
                    isChecked={allChecked || partiallyChecked}
                    onChange={() => {
                      if (allChecked) {
                        setSelected([]);
                      } else {
                        setSelected([...availableColumns]);
                      }
                    }}
                    isAll={true}
                  />
                  {filteredColumns.map(col => (
                    <CheckboxItem
                      key={col.id}
                      label={String(col.header)}
                      isChecked={!!col.id && selected.some(s => s.id === col.id)}
                      onChange={() => col.id && toggleColumn(col.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Selected & reorderable */}
          <div className="ui-config-column-2-sketch text-sm text-gray-900 w-1/2">
            <div className="column-selected-config-sketch ">
              <div className="flex items-center justify-between min-h-[36px] px-4 border-gray-300 border-b">
                <span className="font-normal">{selected.length} columns selected</span>
                <button style={{ height: "auto" }} onClick={() => setSelected([])} className="text-[#1570EF] font-bold text-[16px] cursor-pointer">
                  Clear
                </button>
              </div>
            </div>
            <div className="ui-config-drag-items-sketch ui-config-scrollbar">
              <DndContext
                key={selected.map(col => col.id).join("-")} // Force remount when selected changes
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selected.map(col => col.id).filter((id): id is string => id !== undefined)}
                  strategy={verticalListSortingStrategy}
                >
                  {selected.map(col => (
                    <SortableItem key={col.id} id={col.id!} name={String(col.header)} onRemove={handleRemove} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end mt-4 border-gray-300 border-t pt-4 -mx-4 px-4 ">
          <button onClick={onClose} className="cursor-pointer mr-2 px-4 py-2 border border-gray-300 rounded-md">
            Cancel
          </button>
          <button onClick={() => onSave(selected)} className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
