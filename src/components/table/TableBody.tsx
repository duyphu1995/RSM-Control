import { flexRender, Table } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { noResultFound } from "@/constants/strings";
import { Empty, Typography } from "antd";

interface TableBodyProps<T> {
  table: Table<T>;
  columnsCount: number;
  setObserverRef: (node: HTMLTableRowElement | null) => void;
  hasMore: boolean;
}

// Định nghĩa function component generic
function TableBody<T>({ table, columnsCount, setObserverRef, hasMore }: TableBodyProps<T>) {
  return (
    <table className="min-w-full table-auto border-collapse border-none text-[14px]">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} className="bg-[#F5F5F5] sticky top-0 z-20">
            {headerGroup.headers.map((header, index) => (
              <th
                key={header.id}
                className={`
                  px-4 py-2 border-none text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap
                  ${index === 0 ? "rounded-tl-lg" : ""}
                  ${index === headerGroup.headers.length - 1 ? "rounded-tr-lg" : ""}
                `}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div
                  className="flex items-center justify-between gap-1 text-gray-900 text-sm font-semibold leading-tight cursor-pointer hover:text-black"
                  style={{ width: header.id === "status" ? header.getSize() : "fit-content", gap: "10px" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}

                  <div className="flex flex-col items-center">
                    <ChevronUp size={14} className={`${header.column.getIsSorted() === "asc" ? "text-gray-900" : "text-gray-400"} mb-[-6px]`} />
                    <ChevronDown size={14} className={header.column.getIsSorted() === "desc" ? "text-gray-900" : "text-gray-400"} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50 border border-t border-b border-gray-300">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="px-4 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
        {table.getRowModel().rows.length === 0 && (
          <tr>
            <td colSpan={columnsCount} className="text-center py-8 font-normal text-base">
              <div className="flex flex-col items-center space-y-4">
                <Empty description={<Typography.Text className="text-gray-300">{noResultFound}</Typography.Text>} />
              </div>
            </td>
          </tr>
        )}
        {hasMore && <tr ref={setObserverRef} />}
      </tbody>
    </table>
  );
}

export default TableBody;
