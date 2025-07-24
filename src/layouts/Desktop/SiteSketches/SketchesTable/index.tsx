import { useMemo, useRef, MutableRefObject, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, CellContext, ColumnDef } from "@tanstack/react-table";
import TableBody from "@/components/table/TableBody";
import { Job } from "@/stores/useSketchStore";
import { UIConfigModal } from "../UIConfigModal/UiConfigModal";
import { useSketchUIConfigStore } from "@/stores/useSketchUIConfigStore";
import { updateSiteSketchUiConfig, siteSketchUiConfig } from "@/services/siteSketchesService";
import { useMutation } from "@tanstack/react-query";
import { useExportCsv } from "@/hooks/useCSVExport";
import { useLocation } from "react-router-dom";
import { stringEmDash, TIME_FORMAT } from "@/constants/app_constants.ts";
import dayjs from "dayjs";
import { InputAndDateFilter } from "@/types/SitesSketches";
import { textExportCSV } from "@/constants/strings";
import { Button } from "antd";

interface SketchUIConfigState {
  configType: string;
  columns: string[];
}

interface SketchUIConfigResponseColumn {
  name: string;
  displayName: string;
  order: number | null;
  selected: boolean;
}

interface StetchesTableProps {
  shouldStopRef: any;
  setPage: () => void;
  page: number;
  hasMoreRef: MutableRefObject<boolean>;
  isFetchingRef: MutableRefObject<boolean>;
  fetchedPages: MutableRefObject<Set<number>>;
  attemptedPages: MutableRefObject<Set<number>>;
  siteSketchList: Job[];
  totalRecords: number | 0;
  showUIConfigModal: any;
  setShowUIConfigModal: any;
  handleSortingChange: any;
  setSorting: any;
  sorting: any;
  buildOrderByParam: any;
  fromDate: any;
  toDate: any;
  exportCsvFilters: InputAndDateFilter;
}

export const SketchesTable: React.FC<StetchesTableProps> = ({
  shouldStopRef,
  setPage,
  page,
  hasMoreRef,
  isFetchingRef,
  fetchedPages,
  siteSketchList,
  totalRecords,
  showUIConfigModal,
  setShowUIConfigModal,
  attemptedPages,
  handleSortingChange,
  setSorting,
  sorting,
  exportCsvFilters
}) => {
  const CSV_FILENAME = "site_sketches";

  const [globalFilter, setGlobalFilter] = useState("");

  const location = useLocation();
  const pathname = location.pathname === "/" ? "site-sketch" : location.pathname;
  const config = useSketchUIConfigStore(state => state.config);
  const memoizedExportCsvFilters = useMemo(() => exportCsvFilters, [exportCsvFilters]);
  const mutation = useExportCsv(CSV_FILENAME, pathname, memoizedExportCsvFilters);

  const statusColors: Record<string, string> = {
    "In Production": "#06B6D4",
    Ready: "#D19500",
    Cancelled: "#83664B",
    Delivered: "#22C55E",
    Exception: "#DC2626",
    "Required Booking": "#EC4899",
    "On Hold": "#A855F7",
    "Delivery Booked": "#3B82F6"
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const setObserverRef = (node: HTMLTableRowElement | null) => {
    if (shouldStopRef.current) return;
    if (observer.current) observer.current.disconnect();

    if (node && hasMoreRef.current) {
      observer.current = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry.isIntersecting && !isFetchingRef.current) {
            const nextPage = page + 1;
            if (isFetchingRef.current || !hasMoreRef.current || fetchedPages.current.has(nextPage) || attemptedPages.current.has(nextPage)) return;
            if (!fetchedPages.current.has(nextPage)) setPage();
          }
        },
        {
          root: document.querySelector("#scrollable-table"),
          threshold: 0.1
        }
      );
      observer.current.observe(node);
    }
  };

  const renderCell = (info: any) => {
    const value = info.getValue() as string | number | null | undefined;
    if (value === null || value === undefined || value === "") {
      return stringEmDash;
    }
    return (
      <div className="truncate max-w-[200px]" title={String(value)}>
        {String(value)}
      </div>
    );
  };

  const renderCellWithDate = (info: any, timeFormatted: string) => {
    const rawValue = info.getValue();
    if (!rawValue) {
      return <div>{stringEmDash}</div>;
    }
    const value = String(rawValue);
    const formattedDate = dayjs(value).isValid() ? dayjs(value).format(timeFormatted) : "--";
    return <div>{formattedDate}</div>;
  };

  const columns: ColumnDef<Job, any>[] = useMemo(
    () => [
      {
        id: "sketchJobId",
        accessorKey: "sketchJobId",
        header: "Job ID",
        size: 110,
        cell: renderCell
      },
      {
        id: "sketchJobCode",
        accessorKey: "sketchJobCode",
        header: "Job Code",
        size: 88,
        cell: renderCell
      },
      {
        id: "sketchNumber",
        accessorKey: "sketchNumber",
        header: "Sketch No.",
        size: 88,
        cell: renderCell
      },
      {
        id: "company",
        accessorKey: "companyName",
        header: "Company",
        size: 247,
        cell: info => {
          const text = info.getValue<string>();
          return (
            <div className="truncate max-w-[200px]" title={text || stringEmDash}>
              {text || stringEmDash}
            </div>
          );
        }
      },
      {
        id: "sketchProjectName",
        accessorKey: "sketchProjectName",
        header: "Project Name",
        size: 247,
        cell: renderCell
      },
      {
        id: "sketchJobAddress",
        accessorKey: "sketchJobAddress",
        header: "Project Address",
        size: 247,
        cell: renderCell
      },
      {
        id: "sketchProjectId",
        accessorKey: "sketchProjectId",
        header: "Project ID",
        size: 88,
        cell: renderCell
      },
      { id: "poNumber", accessorKey: "poNumber", header: "P.O No.", size: 118, cell: renderCell },
      {
        id: "orderDate",
        accessorKey: "orderDate",
        header: "Order Date",
        size: 118,
        cell: (info: CellContext<Job, unknown>) => {
          return renderCellWithDate(info, TIME_FORMAT.VN_DATE);
        }
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        size: 130,
        cell: (info: CellContext<Job, unknown>) => {
          return renderCellWithDate(info, TIME_FORMAT.DUE_DATE);
        }
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: (info: CellContext<Job, unknown>) => {
          const value = String(info.getValue() || stringEmDash);
          return (
            <span style={{ backgroundColor: statusColors[value] }} className={`px-2 text-xs py-1 text-white rounded-2xl`}>
              {value}
            </span>
          );
        }
      },
      {
        id: "state",
        accessorKey: "state",
        header: "Pick-up / Delivery",
        size: 138,
        cell: renderCell
      },
      {
        id: "confirmDelivery",
        accessorKey: "confirmDelivery",
        header: "Delivery Confirmed",
        size: 138,
        cell: renderCell
      },
      {
        id: "qcDate",
        accessorKey: "qcDate",
        header: "Ready Date",
        size: 128,
        cell: (info: CellContext<Job, unknown>) => {
          return renderCellWithDate(info, TIME_FORMAT.DATE_HRS);
        }
      },
      {
        id: "completedDate",
        accessorKey: "completedDate",
        header: "Delivered Date",
        size: 128,
        cell: (info: CellContext<Job, unknown>) => {
          return renderCellWithDate(info, TIME_FORMAT.DATE_HRS);
        }
      },
      {
        id: "drawing",
        accessorKey: "drawing",
        header: "Drawing",
        size: 88,
        cell: (info: CellContext<Job, unknown>) => {
          const row = info.row.original as Job;
          const label = row.drawing || stringEmDash;
          const link = row.drawingLink;

          if (!label || !link) {
            return stringEmDash;
          }

          return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              Download
            </a>
          );
        }
      },
      { id: "orderBy", accessorKey: "orderBy", header: "Order By", size: 118, cell: renderCell }
    ],
    []
  );

  const setConfig = useSketchUIConfigStore(state => state.setConfig);

  const getConfig = useMutation({
    mutationFn: siteSketchUiConfig.getSiteSketchUiConfig,
    onSuccess: (data: any) => {
      const serverConfig = data.columns;
      const formatted = serverConfig.map((c: SketchUIConfigResponseColumn, index: number) => ({
        name: c.name,
        displayName: c.displayName,
        order: c.order ?? index,
        selected: c.selected
      }));
      setConfig(formatted);
    },
    onError: error => {
      console.log(error.message);
    }
  });

  useEffect(() => {
    getConfig.mutate();
  }, [setConfig]);

  const visibleColumns = useMemo(() => {
    const selectedMap = new Map(config.filter(c => c.selected).map(c => [c.name, c]));
    return columns
      .filter(col => col.id !== undefined && selectedMap.has(col.id))
      .sort((a, b) => (selectedMap.get(a.id!)?.order ?? 0) - (selectedMap.get(b.id!)?.order ?? 0));
  }, [columns, config]);

  const handleSaveColumns = async (newColumns: ColumnDef<Job>[]) => {
    const updatedConfig = newColumns.map((col, index) => ({
      name: col.id!,
      displayName: String(col.header),
      order: index,
      selected: true
    }));

    setConfig(updatedConfig); // ✅ Now update Zustand only here
    setShowUIConfigModal(false);

    const payload: SketchUIConfigState = {
      configType: "SiteSketch",
      columns: newColumns.map(col => col.id!).filter(Boolean)
    };

    try {
      await updateSiteSketchUiConfig.updateSiteSketchUiConfig(payload);
      console.log("UI config updated successfully");
    } catch (err) {
      console.error("Failed to update UI config", err);
    }
  };

  const table = useReactTable({
    data: siteSketchList,
    columns: visibleColumns,
    state: { globalFilter, sorting },
    manualSorting: true,
    onSortingChange: updater => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      handleSortingChange(newSorting);
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableSortingRemoval: false
  });

  const TableHeader = () => {
    const isExportButtonDisabled = visibleColumns.length === 0;

    return (
      <div className="flex w-full justify-between items-center mb-3">
        <div className="text-black font-semibold text-[14px]">{totalRecords ?? 0} total sketches</div>
        <div className="flex items-center gap-2">
          <Button
            className="!text-orange-600 !h-[35px] disabled:opacity-50 !rounded-md !px-2 !py-1 !space-x-1 !border !border-gray-300 !cursor-pointer !font-semibold !inline-flex !justify-end !items-center"
            onClick={() => mutation.mutate()}
            disabled={totalRecords === 0 || isExportButtonDisabled}
          >
            {textExportCSV}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-0">
      {showUIConfigModal && (
        <UIConfigModal columns={columns} selectedColumns={visibleColumns} onClose={() => setShowUIConfigModal(false)} onSave={handleSaveColumns} />
      )}
      <TableHeader />
      <div>
        <div id="scrollable-table" className="relative max-h-[600px] overflow-y-auto rounded-xl border border-gray-200">
          <TableBody table={table} columnsCount={columns.length} setObserverRef={setObserverRef} hasMore={hasMoreRef.current} />
        </div>
      </div>
    </div>
  );
};
