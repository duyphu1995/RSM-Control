import React, { useRef, useState, useEffect } from "react";
import { Images } from "@/constants/images";
import { SitesSketches, textFilters } from "@/constants/strings";
import { useSketchStore } from "@/stores/useSketchStore";
import { useDateRangeStoreSiteSketch } from "@/hooks/useDateRangeStore";
import { useFilterStore } from "@/stores/useFilterStore";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { Filter } from "./Filter";
import { SketchesTable } from "./SketchesTable";
import { ToolBox } from "./ToolBox/ToolBox";
import { useMutation } from "@tanstack/react-query";
import { siteSkectchNumberStatus, siteSkectchFilter, siteSketchUiConfig } from "@/services/siteSketchesService";
import { siteSketchesService } from "@/services/siteSketchesService";
import { ToastType } from "@/components/common/toast/Toast";
import { THEME } from "@/constants/theme";
import { ChevronUp, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import { InputAndDateFilter } from "@/types/SitesSketches";
import { Button } from "antd";
type SortingState = { id: string; desc: boolean }[];

export const SiteSketches: React.FC = () => {
  type StatusCount = {
    status: string;
    count: number;
    icon: string;
    icColor: string;
  };
  const [isVisible, setIsVisible] = useState(true);

  const { showToast } = useToast();
  const [showUIConfigModal, setShowUIConfigModal] = useState(false);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const page = useSketchStore(state => state.page);
  const setPage = useSketchStore(state => state.setPage);
  const siteSketchList = useSketchStore(state => state.siteSketchList);
  const appendSiteSketchList = useSketchStore(state => state.appendSiteSketchList);
  const siteSketchListPageData = useSketchStore(state => state.siteSketchListPageData);
  const setSiteSketchListPageData = useSketchStore(state => state.setSiteSketchListPageData);

  const fetchedPages = useRef<Set<number>>(new Set());
  const attemptedPages = useRef<Set<number>>(new Set());

  const filters = useFilterStore(state => state.filters);
  const selected = useFilterStore(state => state.selected);
  const setOptions = useFilterStore(state => state.setOptions);

  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const shouldStopRef = useRef(false);
  const pageSize = 15;

  const { startDate, endDate } = useDateRangeStoreSiteSketch();
  const fromDate = startDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");
  const toDate = endDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");

  const [searchInputValue, setSearchInputValue] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [filterSelected, setFilterSelected] = useState<InputAndDateFilter>();

  // Company
  const companyOptions = filters["companies"] || [];
  const selectedCompanies = selected["companies"] || [];

  // ProjectNames
  const projectNamesOptions = filters["projectNames"] || [];
  const selectedProjectNames = selected["projectNames"] || [];

  // OrderBy
  const orderByOptions = filters["orderBy"] || [];
  const selectedOrderBy = selected["orderBy"] || [];

  // JobCodes
  const jobCodesOptions = filters["jobCodes"] || [];
  const selectedJobCodes = selected["jobCodes"] || [];

  // Status
  const statusOptions = filters["statuses"] || [];
  const selectedStatus = selected["statuses"] || [];

  // States
  const statesOptions = filters["states"] || [];
  const selectedStates = selected["states"] || [];

  const addIconColor = (items: any) => {
    const newItems = items.map((item: any) => {
      switch (item.status) {
        case "InProduction":
          item.status = "In Production";
          break;
        case "Completed":
          item.status = "Delivered";
          break;
        default:
          break;
      }
      return {
        ...item,
        icColor: THEME.COLORS.SITES_SKETCHES[item.status?.replace(/\s+/g, "").toUpperCase() as keyof typeof THEME.COLORS.SITES_SKETCHES],
        icon: Images[`Icon${item.status.replace(/\s+/g, "")}` as keyof typeof Images]
      };
    });
    setStatusCounts(newItems);
  };

  const getSketch = useMutation({
    mutationFn: siteSkectchNumberStatus.getNumberStatus,
    onSuccess: (data: any) => {
      addIconColor(data.items);
    },
    onError: error => {
      console.log(error.message);
    }
  });

  const getSiteSketchFilter = useMutation({
    mutationFn: siteSkectchFilter.getSiteSkectchFilter,
    onSuccess: (data: any) => {
      const dataResponse = data;

      // Store all project names
      useFilterStore.getState().setAllProjectNames(dataResponse?.projectNames);

      Object.entries(dataResponse).forEach(([key, options]) => {
        setOptions(
          key,
          (options as any[]).map((c: any) => {
            if (key === "projectNames") {
              return {
                id: c.id,
                displayName: c.displayName,
                companyId: c.companyId
              };
            } else {
              return {
                id: c.id,
                displayName: c.displayName
              };
            }
          })
        );
      });
    },
    onError: _ => {}
  });

  const getSketchUI = useMutation({
    mutationFn: siteSketchUiConfig.getSiteSketchUiConfig,
    onSuccess: () => {},
    onError: error => {
      console.log(error.message);
    }
  });

  useEffect(() => {
    getSketch.mutate();
    getSiteSketchFilter.mutate({ fromDate, toDate });
    getSketchUI.mutate();
    return () => {
      useSketchStore.getState().reset();
    };
  }, []);

  const getSketchData = useMutation({
    mutationFn: siteSketchesService.getSketchesList,
    retry: false,
    onMutate: () => {
      isFetchingRef.current = true;
    },
    onSuccess: (data: any) => {
      const items = data?.items ?? [];
      const pageData = data?.meta;

      appendSiteSketchList(items);
      setSiteSketchListPageData(pageData);

      if (items.length < pageSize) {
        hasMoreRef.current = false;
      }

      fetchedPages.current.add(data?.meta?.page || 1);
    },
    onError: error => {
      showToast(ToastType.error, error.message);
      shouldStopRef.current = true;
    },
    onSettled: (_data, _error, variables) => {
      isFetchingRef.current = false;
      const attemptedPage = variables?.page;
      if (attemptedPage) {
        attemptedPages.current.add(attemptedPage);
      }
    }
  });

  const fetchingSkechData = ({
    fromDate,
    toDate,
    search_text,
    page: currentPage,
    selectedCompany,
    selectedProjectNames,
    selectedOrderByIds,
    selectedJobCodesIds,
    selectedStatusIds,
    selectedStatesIds,
    order_by
  }: any = {}) => {
    const effectivePage = currentPage ?? page;

    if (isFetchingRef.current || attemptedPages.current.has(effectivePage) || shouldStopRef.current) return;

    attemptedPages.current.add(effectivePage);

    const filtersSelected = {
      fromDate,
      toDate,
      search_text,
      page: effectivePage,
      pageSize,
      companyId__in: selectedCompany,
      id__in: selectedProjectNames,
      orderBy__in: selectedOrderByIds,
      sketchJobCode__in: selectedJobCodesIds,
      status__in: selectedStatusIds,
      state__in: selectedStatesIds,
      order_by
    };

    getSketchData.mutate({
      fromDate,
      toDate,
      search_text,
      page: effectivePage,
      pageSize,
      companyId__in: selectedCompany,
      id__in: selectedProjectNames,
      orderBy__in: selectedOrderByIds,
      sketchJobCode__in: selectedJobCodesIds,
      status__in: selectedStatusIds,
      state__in: selectedStatesIds,
      order_by
    });
    setFilterSelected(filtersSelected);
  };

  useEffect(() => {
    if (!attemptedPages.current.has(page) && !isFetchingRef.current && hasMoreRef.current && !shouldStopRef.current) {
      // Company
      const selectedCompanyIds = selectedCompanies.map(c => c.id);
      const selectedAll = selectedCompanyIds.length === companyOptions.length;
      // Project Names
      // const selectedProjectNamesArray = selectedProjectNames.map(c => c.displayName);
      const selectedProjectNamesIds = selectedProjectNames.map(c => c.id);
      const selectedProjectNamesAll = selectedProjectNamesIds.length === projectNamesOptions.length;
      //OrderBy
      const selectedOrderByIds = selectedOrderBy.map(c => c.id);
      const selectedOrderByAll = selectedOrderByIds.length === orderByOptions.length;
      //JobCodes
      const selectedJobCodesIds = selectedJobCodes.map(c => c.id);
      const selectedJobCodesAll = selectedJobCodesIds.length === jobCodesOptions.length;

      //Status
      const selectedStatusIds = selectedStatus.map(c => c.id);
      const selectedStatusAll = selectedStatusIds.length === statusOptions.length;

      //States
      const selectedStatesIds = selectedStates.map(c => c.id);
      const selectedStatesAll = selectedStatesIds.length === statesOptions.length;
      fetchingSkechData({
        fromDate,
        toDate,
        search_text: searchInputValue || undefined,
        page,
        selectedCompany: selectedAll ? undefined : selectedCompanyIds,
        selectedProjectNames: selectedProjectNamesAll ? undefined : selectedProjectNamesIds,
        selectedOrderByIds: selectedOrderByAll ? undefined : selectedOrderByIds,
        selectedJobCodesIds: selectedJobCodesAll ? undefined : selectedJobCodesIds,
        selectedStatusIds: selectedStatusAll ? undefined : selectedStatusIds,
        selectedStatesIds: selectedStatesAll ? undefined : selectedStatesIds,
        order_by: orderBy
      });
    }
  }, [page, selectedCompanies, selectedProjectNames, selectedOrderBy, selectedJobCodes, selectedStatus, selectedStates, orderBy]);

  const handleFilterData = (filterType?: string) => {
    useSketchStore.getState().reset();
    if (filterType !== "filter") {
      useFilterStore.getState().clearFilter();
    }
    attemptedPages.current.clear();
    fetchedPages.current.clear();
    hasMoreRef.current = true;
    isFetchingRef.current = false;
    shouldStopRef.current = false;
    let searchText = searchInputValue;
    let selectedAll = true,
      selectedProjectNamesAll = true,
      selectedOrderByAll = true,
      selectedJobCodesAll = true,
      selectedStatusAll = true,
      selectedStatesAll = true;

    // Company
    const selectedCompanyIds = selectedCompanies.map(c => c.id);
    // Project name
    const selectedProjectNamesIds = selectedProjectNames.map(c => c.id);
    // Order by
    const selectedOrderByIds = selectedOrderBy.map(c => c.id);

    // JobCodes
    const selectedJobCodesIds = selectedJobCodes.map(c => c.id);

    // Status
    const selectedStatusIds = selectedStatus.map(c => c.id);

    //States
    const selectedStatesIds = selectedStates.map(c => c.id);

    if (filterType !== "clearFilter") {
      selectedAll = selectedCompanyIds.length === companyOptions.length;
      selectedProjectNamesAll = selectedProjectNamesIds.length === projectNamesOptions.length;
      selectedStatesAll = selectedStatesIds.length === statesOptions.length;
      selectedStatusAll = selectedStatusIds.length === statusOptions.length;
      selectedJobCodesAll = selectedJobCodesIds.length === jobCodesOptions.length;
      selectedOrderByAll = selectedOrderByIds.length === orderByOptions.length;
    } else {
      searchText = "";
    }
    fetchingSkechData({
      fromDate,
      toDate,
      search_text: searchText || undefined,
      page: 1,
      selectedCompany: selectedAll ? undefined : selectedCompanyIds,
      selectedProjectNames: selectedProjectNamesAll ? undefined : selectedProjectNamesIds,
      selectedOrderByIds: selectedOrderByAll ? undefined : selectedOrderByIds,
      selectedJobCodesIds: selectedJobCodesAll ? undefined : selectedJobCodesIds,
      selectedStatusIds: selectedStatusAll ? undefined : selectedStatusIds,
      selectedStatesIds: selectedStatesAll ? undefined : selectedStatesIds,
      order_by: orderBy
    });
    if (filterType !== "filter") {
      getSiteSketchFilter.mutate({ fromDate, toDate });
    }
  };

  const handleSortingChange = (sorting: SortingState) => {
    const sortField = sorting[0]?.id;
    const sortOrder = sorting[0]?.desc ? "DESC" : "ASC";

    const order_by = sortField ? `{ ${sortField} : ${sortOrder} }` : undefined;
    setOrderBy(order_by);

    // ✅ Now fetch with sorting
    useSketchStore.getState().reset();
    attemptedPages.current.clear();
    fetchedPages.current.clear();
    hasMoreRef.current = true;
    isFetchingRef.current = false;
    shouldStopRef.current = false;

    // Company
    const selectedCompanyIds = selectedCompanies.map(c => c.id);
    const selectedAll = selectedCompanyIds.length === companyOptions.length;

    // Project name
    const selectedProjectNamesIds = selectedProjectNames.map(c => c.id);
    const selectedProjectNamesAll = selectedProjectNamesIds.length === projectNamesOptions.length;

    // Order by
    const selectedOrderByIds = selectedOrderBy.map(c => c.id);
    const selectedOrderByAll = selectedOrderByIds.length === orderByOptions.length;

    // JobCodes
    const selectedJobCodesIds = selectedJobCodes.map(c => c.id);
    const selectedJobCodesAll = selectedJobCodesIds.length === jobCodesOptions.length;

    // Status
    const selectedStatusIds = selectedStatus.map(c => c.id);
    const selectedStatusAll = selectedStatusIds.length === statusOptions.length;

    //States
    const selectedStatesIds = selectedStates.map(c => c.id);
    const selectedStatesAll = selectedStatesIds.length === statesOptions.length;

    fetchingSkechData({
      fromDate,
      toDate,
      search_text: searchInputValue || undefined,
      page: 1,
      selectedCompany: selectedAll ? undefined : selectedCompanyIds,
      selectedProjectNames: selectedProjectNamesAll ? undefined : selectedProjectNamesIds,
      selectedOrderByIds: selectedOrderByAll ? undefined : selectedOrderByIds,
      selectedJobCodesIds: selectedJobCodesAll ? undefined : selectedJobCodesIds,
      selectedStatusIds: selectedStatusAll ? undefined : selectedStatusIds,
      selectedStatesIds: selectedStatesAll ? undefined : selectedStatesIds,
      order_by // Pass sorting here
    });
  };

  const buildOrderByParam = (sorting: SortingState) => {
    if (sorting.length === 0) return undefined;

    const sortField = sorting[0].id;
    const sortOrder = sorting[0].desc ? "DESC" : "ASC";

    return `{ ${sortField} : ${sortOrder} }`;
  };

  const Dashboard = () => {
    // Desired order
    const statusOrder = ["In Production", "Ready", "Delivered"];

    // Sort the statusCounts array by the desired order
    const sortedStatusCounts = [...statusCounts].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    return (
      <div className="w-full h-full justify-start ">
        <div className="text-xl font-semibold leading-loose">{SitesSketches}</div>
        <div className="dashboard h-[70px] w-full inline-flex gap-3">
          {/* Render Dashboard */}
          {sortedStatusCounts.map((data, index) => (
            <div key={index} className="flex-1  items-center inline-flex rounded-lg outline-1 outline-offset-[-1px] outline-gray-200">
              <div className={`mx-3 flex items-center justify-center content rounded-lg w-[36px] h-[36px]`} style={{ backgroundColor: data.icColor }}>
                <div className="flex items-center justify-center  w-[36px]">
                  <img src={data.icon} />
                </div>
              </div>
              <div className="p-3 relative my-3 mr-3 h-[50px] w-full inline-flex flex-col justify-start items-start">
                <div className="absolute top-0 left-0 font-normal w-full justify-start text-gray-500 text-xs">{data.status}</div>
                <div className="absolute bottom-0 left-0 w-full self-stretch justify-start text-gray-900 text-lg font-bold">{data.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-8 my-5">
      <Dashboard />
      <div className="relative">
        <ToolBox
          setShowUIConfigModal={setShowUIConfigModal}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          handleFilterData={handleFilterData}
        />
        <div className="my-3 bg-[#FAFAFA] rounded-md transition-all duration-300 pb-0.5 min-h-[40px] border border-gray-200">
          <div className={`transition-all ${isVisible ? "overflow-visible" : "overflow-hidden"} ${isVisible ? "max-h-[155px] mb-1" : "max-h-10"}`}>
            {isVisible && (
              <div>
                <Filter setOptions={setOptions} handleFilterData={handleFilterData} setSearchInputValue={setSearchInputValue} />
              </div>
            )}
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 z-1 flex flex-col items-center">
              {!isVisible && <span className="font-semibold mb-1">{textFilters}</span>}
              <Button
                onClick={() => setIsVisible(!isVisible)}
                className="!w-[24px] !h-[24px] !p-0 !rounded-full !bg-orange-500 !text-white !flex !items-center !justify-center !shadow-lg !hover:bg-orange-500 !transition-all"
              >
                {isVisible ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SketchesTable
        shouldStopRef={shouldStopRef}
        setShowUIConfigModal={setShowUIConfigModal}
        showUIConfigModal={showUIConfigModal}
        setPage={setPage}
        page={page}
        hasMoreRef={hasMoreRef}
        isFetchingRef={isFetchingRef}
        fetchedPages={fetchedPages}
        siteSketchList={siteSketchList}
        totalRecords={siteSketchListPageData?.totalRecords ?? 0}
        attemptedPages={attemptedPages}
        handleSortingChange={handleSortingChange}
        setSorting={setSorting}
        sorting={sorting}
        buildOrderByParam={buildOrderByParam}
        fromDate={startDate}
        toDate={endDate}
        exportCsvFilters={filterSelected!}
      />
    </div>
  );
};
