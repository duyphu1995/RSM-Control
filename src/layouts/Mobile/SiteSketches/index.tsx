import React, { useRef, useState, useEffect } from "react";
import { useSketchStore } from "@/stores/useSketchStore";
import { useDateRangeStoreSiteSketch } from "@/hooks/useDateRangeStore";
import { useFilterStore } from "@/stores/useFilterStore";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { useMutation } from "@tanstack/react-query";
import { siteSkectchFilter } from "@/services/siteSketchesService";
import { siteSketchesService } from "@/services/siteSketchesService";
import { ToastType } from "@/components/common/toast/Toast";
import { CardItem } from "../CardItem";
import IconExportCSV from "@/assets/icon-export-csv.svg";
import { FilterToolBox } from "../ToolBox/ToolBox";
import { MobileFilterModal } from "../Filter";
import { useExportCsv } from "@/hooks/useCSVExport";
import { useLocation } from "react-router-dom";
import { ExportCSVModal } from "../ExportCSV/ExportCsvMobile";
import { Images } from "@/constants/images.tsx";
import { InputAndDateFilter } from "@/types/SitesSketches";

export const SiteSketchesMobile: React.FC = () => {
  const CSV_FILENAME = "site_sketches";
  const [showExportModal, setShowExportModal] = useState(false);
  const location = useLocation();
  const pathname = location.pathname === "/" ? "site-sketch" : location.pathname;
  const [showModal, setShowUIFilterModal] = useState(false);
  const filters = useFilterStore(state => state.filters);
  const selected = useFilterStore(state => state.selected);
  const setOptions = useFilterStore(state => state.setOptions);
  const [searchInputValue, setSearchInputValue] = useState("");
  const page = useSketchStore(state => state.page);
  const setPage = useSketchStore(state => state.setPage);
  const { showToast } = useToast();
  const fetchedPages = useRef<Set<number>>(new Set());
  const attemptedPages = useRef<Set<number>>(new Set());
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const shouldStopRef = useRef(false);
  const pageSize = 15;

  const startDate = useDateRangeStoreSiteSketch((state: any) => state.startDate);
  const endDate = useDateRangeStoreSiteSketch((state: any) => state.endDate);
  const [filterSelected, setFilterSelected] = useState<InputAndDateFilter>();

  const fromDate = startDate?.format("YYYY-MM-DD");
  const toDate = endDate?.format("YYYY-MM-DD");
  const mutation = useExportCsv(CSV_FILENAME, pathname, filterSelected!);

  const siteSketchList = useSketchStore(state => state.siteSketchList);
  const appendSiteSketchList = useSketchStore(state => state.appendSiteSketchList);
  const setSiteSketchListPageData = useSketchStore(state => state.setSiteSketchListPageData);

  const clearFilter = useFilterStore(state => state.clearFilter);

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

  const getSiteSketchFilter = useMutation({
    mutationFn: siteSkectchFilter.getSiteSkectchFilter,
    onSuccess: (data: any) => {
      const dataResponse = data;

      // Store all project names
      useFilterStore.getState().setAllProjectNames(dataResponse?.projectNames);

      setOptions(
        "projectNames",
        dataResponse?.projectNames.map((c: any) => ({
          id: c.id,
          displayName: c.displayName
        }))
      );
      setOptions(
        "orderBy",
        dataResponse?.projectNames.map((c: any) => ({
          id: c.id,
          displayName: c.displayName
        }))
      );
      setOptions(
        "jobCodes",
        dataResponse?.jobCodes.map((c: any) => ({
          id: c.id,
          displayName: c.displayName
        }))
      );
      setOptions(
        "statuses",
        dataResponse?.statuses.map((c: any) => ({
          id: c.id,
          displayName: c.displayName
        }))
      );
      setOptions(
        "states",
        dataResponse?.states.map((c: any) => ({
          id: c.id,
          displayName: c.displayName
        }))
      );
    },
    onError: error => {
      console.log(error.message);
    }
  });

  useEffect(() => {
    getSiteSketchFilter.mutate({ fromDate, toDate });
    return () => {
      useSketchStore.getState().reset();
    };
  }, []);

  useEffect(() => {
    if (!attemptedPages.current.has(page) && !isFetchingRef.current && hasMoreRef.current && !shouldStopRef.current) {
      // Project Names
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
      fetchingSketchData({
        fromDate,
        toDate,
        search_text: searchInputValue || undefined,
        page,
        selectedProjectNames: selectedProjectNamesAll ? undefined : selectedProjectNamesIds,
        selectedOrderByIds: selectedOrderByAll ? undefined : selectedOrderByIds,
        selectedJobCodesIds: selectedJobCodesAll ? undefined : selectedJobCodesIds,
        selectedStatusIds: selectedStatusAll ? undefined : selectedStatusIds,
        selectedStatesIds: selectedStatesAll ? undefined : selectedStatesIds
      });
    }
  }, [page, selectedProjectNames, selectedOrderBy, selectedJobCodes, selectedStatus, selectedStates]);

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

  const fetchingSketchData = ({
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

    let searchText = searchInputValue,
      selectedProjectNamesAll = true,
      selectedOrderByAll = true,
      selectedJobCodesAll = true,
      selectedStatusAll = true,
      selectedStatesAll = true;

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
      selectedProjectNamesAll = selectedProjectNamesIds.length === projectNamesOptions.length;
      selectedStatesAll = selectedStatesIds.length === statesOptions.length;
      selectedStatusAll = selectedStatusIds.length === statusOptions.length;
      selectedJobCodesAll = selectedJobCodesIds.length === jobCodesOptions.length;
      selectedOrderByAll = selectedOrderByIds.length === orderByOptions.length;
    } else {
      searchText = "";
    }

    fetchingSketchData({
      fromDate,
      toDate,
      search_text: searchText || undefined,
      page: 1,
      selectedProjectNames: selectedProjectNamesAll ? undefined : selectedProjectNamesIds,
      selectedOrderByIds: selectedOrderByAll ? undefined : selectedOrderByIds,
      selectedJobCodesIds: selectedJobCodesAll ? undefined : selectedJobCodesIds,
      selectedStatusIds: selectedStatusAll ? undefined : selectedStatusIds,
      selectedStatesIds: selectedStatesAll ? undefined : selectedStatesIds
    });
    if (filterType !== "filter") {
      getSiteSketchFilter.mutate({ fromDate, toDate });
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const setObserverRef = (node: HTMLDivElement | null) => {
    if (shouldStopRef.current) return;

    if (observer.current) observer.current.disconnect();

    if (node && hasMoreRef.current) {
      observer.current = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry.isIntersecting && !isFetchingRef.current) {
            const nextPage = page + 1;

            if (isFetchingRef.current || !hasMoreRef.current || fetchedPages.current.has(nextPage) || attemptedPages.current.has(nextPage)) return;

            setPage();
          }
        },
        { threshold: 0.1 }
      );
      observer.current.observe(node);
    }
  };

  return (
    <div className="px-4 pt-4 w-full h-full">
      <div className="header-section">
        <div className={` flex relative justify-between items-center`}>
          <h2 className="text-xl font-semibold ">Site Sketches</h2>
          <button
            disabled={siteSketchList.length <= 0}
            onClick={() => setShowExportModal(!showExportModal)}
            className="btn-export text-orange-600 px-3 py-1.5 rounded-md border border-gray-300 inline-flex justify-center items-center"
          >
            <img src={IconExportCSV} className="mr-2" alt="exportCsv" />
            CSV
          </button>
        </div>
        {showModal && (
          <MobileFilterModal
            setSearchInputValue={setSearchInputValue}
            handleFilterData={handleFilterData}
            setOptions={setOptions}
            onClose={() => setShowUIFilterModal(false)}
          />
        )}
        <FilterToolBox
          handleFilterData={handleFilterData}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          setShowUIFilterModal={setShowUIFilterModal}
        />
        {siteSketchList.length > 0 ? (
          <>
            <div className="text-gray-900"> {siteSketchList.length} total sketches</div>
            <div className="sketch-data-section mt-4">
              {siteSketchList.map((item: any, index: number) => {
                const isLastItem = index === siteSketchList.length - 1;

                return (
                  <div key={item.sketchJobId} ref={isLastItem ? setObserverRef : null}>
                    <CardItem data={item} />
                  </div>
                );
              })}
              {isFetchingRef.current && <div className="absolute text-center text-gray-500 py-4">Loading more...</div>}
            </div>
          </>
        ) : (
          <>
            <div className="width[366px] h-1/2 ">
              <div className="flex flex-col items-center text-center mt-[50px]">
                <img alt={""} src={Images.IconDocument} />
                <span className="my-[16px] font-[16px]">
                  We are always at your service.
                  <br /> Contact us for new project!
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      {showExportModal && (
        <ExportCSVModal
          totalRecords={siteSketchList.length}
          onCancel={() => setShowExportModal(false)}
          onConfirm={() => {
            mutation.mutate();
            setShowExportModal(false);
          }}
        />
      )}
    </div>
  );
};
