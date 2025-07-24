export interface InputAndDateFilter {
  fromDate?: string;
  toDate?: string;
  search_text?: string;
  page?: number;
  pageSize?: number;
  companyId__in?: string[];
  id__in?: string[];
  orderBy__in?: string[];
  sketchJobCode__in?: string[];
  status__in?: string[];
  state__in?: string[];
  order_by?: string;
  timezone?: string;
}
