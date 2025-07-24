import React, { useState, useMemo } from "react";
import { DndContext, closestCenter, DragEndEvent, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Images } from "@/constants/images";
import { useSketchUIConfigStore } from "@/stores/useSketchUIConfigStore";
import { ColumnType } from "antd/es/table";
import { Button, Modal } from "antd";
import { textClear, textUIConfig } from "@/constants/strings.ts";
import "./index.css";
import { Check, Minus } from "lucide-react";

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

  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-[#F9FAFB] rounded-md mb-1 cursor-move pl-2 pr-2"
    >
      <div className="flex">
        <img src={Images.IconDragAndDrop} />
        <span className="ml-2 text-black">{name}</span>
      </div>
      <button onClick={handleRemoveClick} className="text-gray-500 text-2xl cursor-pointer">
        ✕
      </button>
    </div>
  );
};

export type UIConfigModalProps<T> = {
  isShowUIConfigModal: boolean;
  columns: ColumnType<T>[];
  selectedColumns: ColumnType<T>[];
  onClose: () => void;
  onSave: (selected: ColumnType<T>[]) => void;
};

export function UIConfigModal<T>({ isShowUIConfigModal, columns, selectedColumns, onClose, onSave }: UIConfigModalProps<T>) {
  const config = useSketchUIConfigStore(state => state.config);
  const updateOrder = useSketchUIConfigStore(state => state.updateOrder);

  const [availableColumns] = useState(columns);
  const [selected, setSelected] = useState(selectedColumns);

  const [search, setSearch] = useState("");

  const filteredColumns = useMemo(() => {
    return availableColumns.filter(col => String(col.title).toLowerCase().includes(search.toLowerCase()));
  }, [search, availableColumns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const names = config.filter(c => c.selected).map(c => c.name);
      const oldIdx = names.indexOf(active.id as string);
      const newIdx = names.indexOf(over.id as string);
      const newOrder = arrayMove(names, oldIdx, newIdx);

      updateOrder(newOrder);

      setSelected(prev => {
        const ordered = arrayMove(
          [...prev],
          prev.findIndex(c => c.key === active.id),
          prev.findIndex(c => c.key === over.id)
        );
        return ordered;
      });
    }
  };

  const toggleColumn = (id: string) => {
    if (!id) return;
    setSelected(prev => {
      const exists = prev.some(col => col.key === id);
      if (exists) {
        return prev.filter(col => col.key !== id);
      }
      const colToAdd = availableColumns.find(col => col.key === id);
      return colToAdd ? [...prev, colToAdd] : prev;
    });
  };

  const handleRemove = (id: string) => {
    setSelected(selected.filter(col => col.key !== id));
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
      <div className="flex items-center cursor-pointer select-none" onClick={onChange}>
        <div className="w-5 h-5 flex items-center justify-center border-2 border-orange-500 rounded-md bg-white">
          {isAll && (allChecked || partiallyChecked) && (
            <div className="bg-orange-500 w-full h-full flex items-center justify-center  text-white">
              {allChecked ? <Check size={14} /> : <Minus size={14} />}
            </div>
          )}

          {!isAll && isChecked && (
            <div className="bg-orange-500 w-full h-full flex items-center justify-center text-white">
              <Check size={14} />
            </div>
          )}
        </div>
        <span className="pl-4 text-sm text-gray-900">{label}</span>
      </div>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  return (
    <Modal centered open={isShowUIConfigModal} footer={null} closeIcon={false}>
      <div className="ui-config-modal fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[700px] p-4 ui-config-container">
          {/* Close Icon */}
          <Button
            onClick={onClose}
            className="!absolute !top-4 !rounded-md !border-white !right-4 !text-gray-500 !hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
          <h2 className="text-lg font-semibold mb-4">{textUIConfig}</h2>

          {/* Gray line */}
          <div className="-mx-4 border-b border-gray-200" />

          <div className="flex gap-4 pt-5 pb-5">
            <div className="w-1/2">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search column"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

              {/* Config column */}
              <div className="pt-3">
                <div className="flex flex-col h-[60vh] max-w-full p-4 rounded-lg border border-gray-300">
                  <div className="overflow-y-auto flex-1">
                    <div className="flex items-center mb-4 cursor-pointer select-none">
                      <label className="relative flex items-center space-x-2">
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
                      </label>
                    </div>
                    {filteredColumns.map(col => (
                      <div key={col.key} className="flex items-center mb-4 cursor-pointer select-none">
                        <label className="relative flex items-center space-x-2">
                          <input
                            type="checkbox"
                            disabled={!col.key}
                            checked={!!col.key && selected.some(s => s.key === col.key)}
                            onChange={() => col.key && toggleColumn(col.key.toString())}
                            className="peer appearance-none h-5 w-5 border-2 border-orange-500 rounded-md checked:bg-orange-500 checked:border-orange-500"
                          />
                          <svg
                            className="absolute left-0 ml-[4px] w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-black pl-2">{col.title?.toString()}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ui-config-column-2 w-1/2">
              <div className="column-selected-config">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal">{selected.length} columns selected</span>
                  <button onClick={() => setSelected([])} className="!text-blue-500 border border-white !font-medium text-sm cursor-pointer pr-2">
                    {textClear}
                  </button>
                </div>
              </div>

              <div className="ui-config-drag-items ui-config-scrollbar">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                  <SortableContext
                    items={selected.map(col => col.key).filter((id): id is string => id !== undefined)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selected.map(col => (
                      <SortableItem key={col.key} id={col.key!.toString()} name={String(col.title)} onRemove={handleRemove} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>

          {/* Gray line */}
          <div className="-mx-4 border-b border-gray-200" />

          <div className="flex justify-end mt-4">
            <Button
              onClick={onClose}
              className="!cursor-pointer !mr-2 !px-4 !py-4 !transition !duration-150 !rounded !hover:bg-gray-50 !border !rounded-md"
            >
              Cancel
            </Button>
            <Button onClick={() => onSave(selected)} className="!bg-orange-500 !cursor-pointer !text-white !px-4 !py-4 !rounded-md">
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
