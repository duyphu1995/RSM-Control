import pathnames from "@/pathnames";
import SearchBox from "./SearchBox";
import FilterMajorProjects from "./Filter";
import { IFilterData, IMajorProjectJob, MajorProjectJobResponse, MajorProjectSearchBody } from "@/types/majorProjects";
import { useEffect, useState } from "react";
import majorProjectsService from "@/services/majorProjectsService";
import { useMajorProjectStore } from "@/stores/majorProjectStore.ts";
import * as dateRangeStore from "@/hooks/useDateRangeStore";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import BaseTable from "@/components/table-ant/table.tsx";
import { ColumnType } from "antd/es/table";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { renderWithFallback } from "@/components/table-ant/render-table-common";
import dayjs from "dayjs";
import { useResponsive } from "@/hooks/useResponsive.ts";
import { Button, Input, List, Skeleton } from "antd";
import { Images } from "@/constants/images.tsx";
import { searchByPieceNumber, somethingWentWrong, textTotalProjects } from "@/constants/strings.ts";
import { ROUTES, THEME } from "@/constants";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { DateRangeSelector } from "@/layouts/Mobile/ToolBox/DateRangeSelector.tsx";
import { MajorProjectFilter } from "@/layouts/Desktop/MajorProjects/MajorProjectFilter.tsx";
import { sortASC, sortDESC, TIME_FORMAT } from "@/constants/app_constants.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import { SortIcon } from "@/components/common/SortIcon.tsx";
import { formatTimeDayMonthYear } from "@/components/table-ant/table-common";
import { MenuItem } from "@/stores/sidebarStore";
import EmptyBox from "@/components/empty-box";

const MajorProjectsDesktop = () => {
  const tabTitle = pathnames.majorProjects.main.name;
  const tabTitleMobile = pathnames.majorProjects.mainMobile.name;

  const { isMobile } = useResponsive();
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const { showToast } = useToast();
  const { startDate, endDate } = dateRangeStore.useDateRangeStoreMajor();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [actionColumnWidth, setActionColumnWidth] = useState(120);

  const {
    companyId__in,
    id__in,
    search_text,
    filters,
    page,
    tempFilters,
    setFromDate,
    setToDate,
    setFilters,
    setTempFilters,
    setSearchText,
    setCompanyIdIn,
    setIdIn,
    setPage,
    getSearchParams,
    sortModel,
    setSortModel,
    setDataResponse,
    dataResponse,
    setPageSize,
    setOrderBy
  } = useMajorProjectStore(
    useShallow(state => ({
      order_by: state.order_by,
      pageSize: state.pageSize,
      page: state.page,
      fromDate: state.fromDate,
      toDate: state.toDate,
      search_text: state.search_text,
      companyId__in: state.companyId__in,
      id__in: state.id__in,
      filters: state.filters,
      tempFilters: state.tempFilters,
      setOrderBy: state.setOrderBy,
      setPageSize: state.setPageSize,
      setPage: state.setPage,
      setFromDate: state.setFromDate,
      setToDate: state.setToDate,
      setSearchText: state.setSearchText,
      setCompanyIdIn: state.setCompanyIdIn,
      setIdIn: state.setIdIn,
      setAllSearchParams: state.setAllSearchParams,
      getSearchParams: state.getSearchParams,
      resetSearchParams: state.resetSearchParams,
      setDataResponse: state.setDataResponse,
      setFilters: state.setFilters,
      setTempFilters: state.setTempFilters,
      sortModel: state.sortModel,
      setSortModel: state.setSortModel,
      dataResponse: state.dataResponse
    }))
  );

  const fetchMajorProjectsJobsMutation = useMutation<MajorProjectJobResponse, Error, MajorProjectSearchBody>({
    mutationFn: params => majorProjectsService.getMajorProjectsList(params),
    onSuccess: (data: MajorProjectJobResponse) => {
      setDataResponse(data);
    },
    onError: _ => {
      showToast(ToastType.error, somethingWentWrong);
    }
  });

  const getFilterMutation = useMutation({
    mutationFn: majorProjectsService.getFilter,
    onSuccess: (data: IFilterData) => {
      setFilters(data);
      setTempFilters(data);
      const companyOptions: string[] = data.companies?.map(company => company.id) || [];
      const projectOptions: string[] = data.projectNames?.map(project => project.id) || [];
      setCompanyIdIn(companyOptions);
      setIdIn(projectOptions);
    },
    onError: _ => {
      showToast(ToastType.error, somethingWentWrong);
    }
  });

  const handleFilterData = (needFetchFilter?: boolean) => {
    setFromDate(startDate?.format(TIME_FORMAT.DATE) ?? "");
    setToDate(endDate?.format(TIME_FORMAT.DATE) ?? "");
    setPage(1);
    setPageSize(20);
    const payload: MajorProjectSearchBody = getSearchParams();
    if (needFetchFilter) getFilterMutation.mutate({ fromDate: payload.fromDate || "", toDate: payload.toDate || "" });
    fetchMajorProjectsJobsMutation.mutate(payload);
  };

  useEffect(() => {
    setFromDate(startDate?.format(TIME_FORMAT.DATE) ?? undefined);
    setToDate(endDate?.format(TIME_FORMAT.DATE) ?? undefined);
    const initialJobsPayload: MajorProjectSearchBody = getSearchParams();
    fetchMajorProjectsJobsMutation.mutate(initialJobsPayload);
    getFilterMutation.mutate({
      fromDate: initialJobsPayload.fromDate ?? "",
      toDate: initialJobsPayload.toDate ?? ""
    });
    if (navigationType === "POP") {
      initialJobsPayload.id__in = [];
      initialJobsPayload.companyId__in = [];
      fetchMajorProjectsJobsMutation.mutate(initialJobsPayload);
    }

    const updateWidth = () => {
      if (window.innerWidth > 1280) {
        setActionColumnWidth(120);
      } else {
        setActionColumnWidth(180);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [location]);

  const getSortDirection = (name: string) => (sortModel.columnKey === name ? (sortModel.order === sortASC ? "ascend" : "descend") : null);

  const columns: ColumnType<IMajorProjectJob>[] = [
    {
      dataIndex: "id",
      key: "id",
      title: "Id",
      width: 1,
      hidden: true,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Project Name",
      width: 200,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item),
      sortOrder: getSortDirection("name")
    },
    {
      dataIndex: "projectAddress",
      key: "projectAddress",
      title: "Project Address",
      width: 300,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      sortOrder: getSortDirection("projectAddress"),
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "companyName",
      key: "companyName",
      title: "Company",
      width: 250,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      sortOrder: getSortDirection("companyName"),
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "startDate",
      key: "startDate",
      title: "Start Date",
      width: 140,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      sortOrder: getSortDirection("startDate"),
      render: item => renderWithFallback(formatTimeDayMonthYear(item))
    },
    {
      dataIndex: "lastActivityDate",
      key: "lastActivityDate",
      title: "Last Activity Date",
      width: 180,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      sortOrder: getSortDirection("lastActivityDate"),
      render: item => renderWithFallback(formatTimeDayMonthYear(item))
    },
    {
      dataIndex: "numOfJobs",
      key: "numOfJobs",
      title: "Jobs",
      width: 80,
      sorter: true,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      sortOrder: getSortDirection("numOfJobs"),
      render: item => renderWithFallback(item)
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      width: actionColumnWidth,
      render: (_, record) => (
        <div className="flex gap-3 text-nowrap">
          <Link to={ROUTES.JOBS_LIST + `?tab=${MenuItem.majorlProject}`} state={{ id: record.id, name: record.name, projectId: record.projectId }}>
            View Jobs
          </Link>
          <Link
            to={ROUTES.VIEW_PROJECT_ITEM_DETAIL + `?tab=${MenuItem.majorlProject}`}
            state={{ id: record.id, name: record.name, projectId: record.projectId }}
          >
            View Items
          </Link>
        </div>
      )
    }
  ];

  const tableHeader = (isMobile: boolean) =>
    isMobile ? (
      <div className="flex w-full justify-between items-center pl-3 mb-3 mt-[24px]">
        <div className="text-black font-light text-sm">
          {dataResponse.meta.totalRecords} {textTotalProjects}
        </div>
      </div>
    ) : (
      <div className="flex w-full justify-between items-center mb-3 mt-[20px]">
        <div className="text-black font-semibold text-sm">
          {dataResponse.meta.totalRecords} {textTotalProjects}
        </div>
      </div>
    );

  // #region Lazy Loading
  const handleLoadMore = () => {
    if (!dataResponse.meta.hasNextPage) return;
    setPage((page ?? 0) + 1);
    setPageSize(20);
    fetchMajorProjectsJobsMutation.mutate(getSearchParams());
  };
  // #endregion Lazy Loading

  // #region Sort
  const handleCreateSorter = (_pagination: any, _filters: any, sorter: any) => {
    const { field, order } = sorter;
    let orderBy = {};
    const sortDirection = order === "ascend" ? sortASC : sortDESC;
    if (order && field) {
      orderBy = { [field === "companyName" ? "company.name" : field]: order === "ascend" ? "ASC" : "DESC" };
    }
    setSortModel({
      order: sortDirection,
      columnKey: sorter.columnKey
    });
    setPage(1);
    setPageSize(20);
    setOrderBy(Object.keys(orderBy).length > 0 ? JSON.stringify(orderBy) : undefined);
    fetchMajorProjectsJobsMutation.mutate(getSearchParams());
  };
  // #endregion Sort

  // #region Render Desktop
  const renderDesktopLayout = () => {
    return (
      <div className="mx-8 my-5">
        <div className="text-xl font-semibold leading-loose">{tabTitle}</div>

        <SearchBox
          searchInputValue={search_text ?? ""}
          setSearchInputValue={setSearchText}
          handleFilterData={flag => handleFilterData(flag)}
          isUiConfig={false}
          columnsUIConfig={[]}
          selectedColumns={[]}
          fromDate={startDate?.format(TIME_FORMAT.DATE) ?? ""}
          toDate={endDate?.format(TIME_FORMAT.DATE) ?? ""}
        />
        <FilterMajorProjects
          handleFilterData={handleFilterData}
          filters={filters}
          selectedCompany={companyId__in}
          setSelectedCompany={setCompanyIdIn}
          setTempFilters={setTempFilters}
          selectedProject={id__in}
          setSelectedProject={setIdIn}
          setSearchInputValue={setSearchText}
          tempFilters={tempFilters}
        />
        {tableHeader(false)}
        <BaseTable
          columns={columns}
          rowKey="id"
          dataSource={dataResponse.items ?? []}
          style={{ marginTop: 12 }}
          onLoadMore={handleLoadMore}
          onChange={handleCreateSorter}
          loading={fetchMajorProjectsJobsMutation.isPending}
        />
      </div>
    );
  };
  // #endregion Render Desktop

  // #region Render Mobile
  const renderMobileLayout = () => {
    const buildMobileHeader = () => (
      <div className="self-stretch justify-between items-center inline-flex overflow-hidden w-full pl-3 mt-6 pr-3">
        <div className="flex self-stretch relative justify-start items-start">
          <h1 className="font-semibold text-[20px] items-start flex justify-start">{tabTitleMobile}</h1>
        </div>
      </div>
    );

    const buildMobileDateSection = () => (
      <div className="mx-3 mt-2">
        <div className="flex items-center px-1 py-0 space-x-1 border border-gray-300 rounded-md" style={{ height: "40px" }}>
          <DateRangeSelector handleFilterData={() => handleFilterData(true)} label="Last Activity Date" isMobile={true} />
        </div>
      </div>
    );

    const buildMobileFilterSection = () => (
      <div className="flex h-10 gap-3 mt-5 ml-3 mr-3">
        <Input
          placeholder={searchByPieceNumber}
          prefix={<img src={Images.IconSearch} alt="search" className="ml-1 mr-1" />}
          className=""
          value={search_text}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={() => handleFilterData(false)}
        />
        <Button
          icon={<img src={Images.IconFilter} alt="filter" />}
          className="rounded-md border border-gray-300 cursor-pointer"
          style={{
            height: "40px",
            width: "40px",
            color: THEME.COLORS.PRIMARY
          }}
          onClick={() => {
            setFiltersModalVisible(true);
          }}
        ></Button>
      </div>
    );

    const MajorProjectJobCard = (job: IMajorProjectJob) => {
      return (
        <div key={job.id} className="bg-white p-4 rounded-md mb-3 border-1 border-gray-200">
          <div className="font-semibold text-lg">{job.name || job.companyName || "N/A"}</div>

          <div className="flex justify-between mt-2">
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Last Activity Date</div>
              <div className="text-gray-900 text-[16px] font-medium mt-1">{dayjs(job.lastActivityDate).format("DD/MM/YYYY")}</div>
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Start Date</div>
              <div className="text-gray-900 text-[16px] font-medium mt-1">{dayjs(job.startDate).format("DD/MM/YYYY")}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-gray-500 text-sm">Jobs</div>
            <div className="text-gray-900 text-[16px] font-medium mt-1">{job.numOfJobs}</div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              className="h-full flex-1 text-orange-600 rounded-md border border-gray-300 cursor-pointer"
              style={{
                height: "40px",
                color: THEME.COLORS.PRIMARY
              }}
              onClick={() => {
                navigate(ROUTES.JOBS_LIST + `?tab=${MenuItem.majorlProject}`, {
                  state: { id: job.id, name: job.name, projectId: job.projectId }
                });
              }}
            >
              View Jobs
            </Button>
            <Button
              className="h-full flex-1 text-orange-600 rounded-md border border-gray-300 cursor-pointer"
              style={{
                height: "40px",
                color: THEME.COLORS.PRIMARY
              }}
              onClick={() => {
                navigate(ROUTES.VIEW_PROJECT_ITEM_DETAIL, { state: { id: job.id, name: job.name, projectId: job.projectId } });
              }}
            >
              View Items
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div>
        {buildMobileHeader()}
        {buildMobileDateSection()}
        {buildMobileFilterSection()}
        {tableHeader(true)}
        <div className="mx-3">
          <div id="scrollableDiv">
            <InfiniteScroll
              next={handleLoadMore}
              hasMore={dataResponse.meta.hasNextPage}
              dataLength={dataResponse.items.length}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              <List
                split={false}
                itemLayout="vertical"
                dataSource={dataResponse.items ?? []}
                locale={{
                  emptyText: <EmptyBox loading={false} />
                }}
                renderItem={job => (
                  <List.Item key={job.id} style={{ padding: 0, borderBottom: "none" }}>
                    {" "}
                    {MajorProjectJobCard(job)}
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </div>
        <MajorProjectFilter
          isVisible={isFiltersModalVisible}
          onCancel={() => setFiltersModalVisible(false)}
          onClearFilters={() => {
            const companyOptions: string[] = filters.companies?.map(company => company.id) || [];
            const projectOptions: string[] = filters.projectNames?.map(project => project.id) || [];
            setCompanyIdIn(companyOptions);
            setIdIn(projectOptions);
            setTempFilters({
              companies: filters.companies,
              projectNames: filters.projectNames
            });
            setSearchText("");
            handleFilterData();
          }}
          onApplyFilters={handleFilterData}
        />
        {(fetchMajorProjectsJobsMutation.isPending || getFilterMutation.isPending) && <LoadingComponent isPending={true} />}
      </div>
    );
  };
  // #endregion Render Mobile
  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default MajorProjectsDesktop;
