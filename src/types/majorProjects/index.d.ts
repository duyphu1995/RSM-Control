import { ColumnType } from "antd/es/table";
export interface IOptionsFilter {
  id: string;
  displayName: string;
  companyId?: string;
}

export interface IFilterData {
  companies: IOptionsFilter[];
  projectNames: IOptionsFilter[];
}

export interface SearchBoxProps {
  fromDate?: string;
  toDate?: string;
  handleFilterData: (value: boolean) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  isUiConfig: boolean;
  columnsUIConfig: ColumnType<any>[];
  selectedColumns: ColumnType<IMajorProjectJobDetails>[];
}

export interface IMajorProjectsFilter {
  handleFilterData: () => void;
  filters: IFilterData;
  tempFilters: IFilterData;
  selectedCompany: string[];
  setSelectedCompany: (value: string[]) => void;
  selectedProject: string[];
  setSelectedProject: (value: string[]) => void;
  setTempFilters: (value: IFilterData) => void;
  setSearchInputValue: (value: string) => void;
}

export interface IMajorProjectsJobsListFilter {
  onApplyFilters: () => void;
  filtersOptions?: IJobsListFilterOptions;
  onCancel: () => void;
  onClearFilters: () => void;
}

export interface IJobsListFilterOptions {
  jobLocations: IOptionsFilter[];
  drawingNumbers: IOptionsFilter[];
  jobCodes: IOptionsFilter[];
  statuses: IOptionsFilter[];
  deliveryNumbers: IOptionsFilter[];
}

export interface MajorProjectSearchBody {
  order_by?: string;
  pageSize?: number;
  page?: number;
  fromDate?: string;
  toDate?: string;
  search_text?: string;
  companyId__in?: string[];
  id__in?: string[];
}

interface MajorProjectFilterBody {
  fromDate: string;
  toDate: string;
}

export interface IMajorProjectJobDetails {
  id: string;
  jobCodeAndPart: string;
  jobLocation: string;
  importDate: string;
  jobDueDate: string;
  jobReadyQty: string;
  jobDeliveredQty: string;
  status: string;
  jobProgress: string;
  state: string;
  confirmDelivery: boolean;
  deliveryNumbers: string[];
  deliveredDate: string;
  drawingNumber: string;
  projectId: string;
  projectName: string;
}

export interface IMajorProjectJobDetailsResponse {
  items: IMajorProjectJobDetails[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  count: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  type: string; // Thường là "paging"
}

export interface MajorProjectJobResponse {
  items: IMajorProjectJob[];
  meta: PaginationMeta;
}

export interface IMajorProjectJob {
  companyName: string;
  projectAddress: string;
  projectId: string;
  name: string;
  startDate: string;
  lastActivityDate: string;
  numOfJobs: string;
  id: string;
  jobCode: string;
}

export interface IMajorProjectJobsList {
  pageSize?: number;
  page?: number;
  projectId__in: string[];
  search_text?: string;
  order_by?: Record<string, any>;
  jobLocation__in?: string[];
  drawingNumber__in?: string[];
  jobCode__in?: string[];
  status__in?: string[];
  deliveryNumbers__in?: string[];
}

export interface IApplyFilter {
  projectId__in: string[];
  jobLocation__in?: string[];
  drawingNumber__in?: string[];
  jobCode__in?: string[];
  status__in?: string[];
  deliveryNumbers__in?: string[];
}

export interface IExportCSV {
  projectId__in: string[];
}

export interface JobsListFiltersMobileProps {
  isVisible: boolean;
  onCancel: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}
