import pathnames from "@/pathnames";
import SearchBox from "../SearchBox";
import { useEffect, useMemo, useState } from "react";
import {
  IExportCSV,
  IJobsListFilterOptions,
  IMajorProjectJobDetails,
  IMajorProjectJobDetailsResponse,
  IMajorProjectJobsList
} from "@/types/majorProjects";
import BaseTable from "@/components/table-ant/table";
import { ColumnType } from "antd/es/table";
import { renderWithFallback } from "@/components/table-ant/render-table-common";
import { formatTimeDayMonthYear, formatTimeWeekDayMonthYear } from "@/components/table-ant/table-common";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import majorProjectsService from "@/services/majorProjectsService";
import { Button, Flex, Input, List, Skeleton, Tag } from "antd";
import majorProjectService from "@/services/majorProjectsService";
import { useToast } from "@/components/common/toast/ToastProvider";
import { ToastType } from "@/components/common/toast/Toast";
import {
  searchPlaceHolderMajorProjectsJobsList,
  somethingWentWrong,
  textApply,
  textClear,
  textCSV,
  textExportCSV,
  textFilters,
  txtExportCSVSuccessfully
} from "@/constants/strings";
import { useMajorProjectJobListStore } from "@/stores/majorProjectJobsListStore";
import { useShallow } from "zustand/shallow";
import { DropdownSelector } from "@/components/dropdown/DropDown";
import { useResponsive } from "@/hooks/useResponsive";
import { Images } from "@/constants/images";
import { SearchOutlined } from "@ant-design/icons";
import { THEME } from "@/constants/theme";
import ViewJobsListDetailItemCard from "./mobile";
import { ErrorResponse } from "@/services/api";
import { ROUTES } from "@/constants";
import { ChevronDown, ChevronUp } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner";
import { sortASC, sortDESC, STATUS_FORMAT_COLOR } from "@/constants/app_constants";
import { usePrintDeliveryDocketMutation } from "@/utils/printDeliveryUtil.ts";
import JobsListFiltersMobile from "./mobile/filter";
import { SortIcon } from "@/components/common/SortIcon.tsx";
import { MenuItem } from "@/stores/sidebarStore";
import EmptyBox from "@/components/empty-box";

const MajorProjectJobsList = () => {
  const location = useLocation();
  const dataHeader = location.state;
  const tabTitle = pathnames.majorProjects.viewJobsList.name;
  const tabTitleMobile = pathnames.majorProjects.viewJobsListMobile.name;
  const { isMobile } = useResponsive();
  const [orderBy, setOrderBy] = useState<Record<string, any>>();
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [localData, setLocalData] = useState<IMajorProjectJobDetails[]>([]);
  const { showToast } = useToast();
  const exportFileName = "major_project_jobs_list_" + dataHeader.projectId + ".csv";
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [dataLength, setDataLength] = useState<number>(0);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(0);
  const initialJobsListPayload: IMajorProjectJobsList = {
    page: 1,
    pageSize: 20,
    projectId__in: [dataHeader.id]
  };

  const {
    filter,
    selectedJobLocations,
    setSelectedJobLocations,
    selectedDrawingNumbers,
    setSelectedDrawingNumbers,
    selectedJobCodes,
    setSelectedJobCodes,
    selectedJobStatus,
    setSelectedJobStatus,
    selectedDeliveryDocket,
    setSelectedDeliveryDocket,
    uiConfig,
    setUIConfig,
    search_text,
    setSearchText,
    setDataResponse,
    setFilter
  } = useMajorProjectJobListStore(
    useShallow(state => ({
      pageSize: state.pageSize,
      page: state.page,
      search_text: state.search_text,
      projectId__in: state.projectId__in,
      setPageSize: state.setPageSize,
      setPage: state.setPage,
      setSearchText: state.setSearchText,
      setAllSearchParams: state.setAllSearchParams,
      resetSearchParams: state.resetSearchParams,
      setDataResponse: state.setDataResponse,
      dataResponse: state.dataResponse,
      selectedJobLocations: state.selectedJobLocations,
      selectedDrawingNumbers: state.selectedDrawingNumber,
      selectedJobCodes: state.selectedJobCodes,
      selectedDeliveryDocket: state.selectedDeliveryDocket,
      selectedJobStatus: state.selectedJobStatus,
      setSelectedJobLocations: state.setSelectedJobLocations,
      setSelectedDeliveryDocket: state.setSelectedDeliveryDocket,
      setSelectedDrawingNumbers: state.setSelectedDrawingNumber,
      setSelectedJobCodes: state.setSelectedJobCodes,
      setSelectedJobStatus: state.setSelectedJobStatus,
      uiConfig: state.uiConfig,
      setUIConfig: state.setUIConfig,
      setFilter: state.setFilter,
      filter: state.filters
    }))
  );

  // #region Column
  const columns: ColumnType<IMajorProjectJobDetails>[] = [
    {
      dataIndex: "id",
      key: "id",
      title: "Id",
      width: 1,
      hidden: true,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "jobCodeAndPart",
      key: "jobCodeAndPart",
      title: "Job Code",
      width: 180,
      fixed: "left",
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "jobLocation",
      key: "jobLocation",
      title: "Job Location",
      width: 250,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "importDate",
      key: "importDate",
      title: "Start Date",
      width: 139,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(formatTimeDayMonthYear(item))
    },
    {
      dataIndex: "jobDueDate",
      key: "jobDueDate",
      title: "Due Date",
      width: 139,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(formatTimeWeekDayMonthYear(item)),
      defaultSortOrder: "ascend"
    },
    {
      dataIndex: "jobReadyQty",
      key: "jobReadyQty",
      title: "Ready Qty",
      width: 139,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "jobDeliveredQty",
      key: "jobDeliveredQty",
      title: "Delivered Qty",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 170,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: (status: string) => {
        const color = STATUS_FORMAT_COLOR[status] || STATUS_FORMAT_COLOR["default"];
        return (
          <Tag
            color={color}
            style={{
              color: "white",
              borderRadius: 20,
              padding: "0 12px",
              fontWeight: 500,
              fontSize: 12
            }}
          >
            {status}
          </Tag>
        );
      }
    },
    {
      dataIndex: "jobProgress",
      key: "jobProgress",
      title: "Progress",
      width: 250,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "state",
      key: "state",
      title: "Pick up / Delivery",
      width: 180,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      dataIndex: "confirmDelivery",
      key: "confirmDelivery",
      title: "Delivery Confirmed",
      width: 200,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item ? "Yes" : "No")
    },
    {
      dataIndex: "deliveryNumbers",
      key: "deliveryNumbers",
      title: "Delivery Docket",
      width: 200,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: (item: Array<string>) =>
        !item || item.length === 0 ? (
          renderWithFallback(item)
        ) : (
          <>
            {item.map((singleItem, index) => (
              <div
                key={index}
                className="text-blue-600 cursor-pointer"
                onClick={() => handlePrintDeliveryDocket(singleItem)}
                style={{ display: "inline-block", marginRight: "5px" }}
              >
                {singleItem}
                {index < item.length - 1 ? "," : ""}
              </div>
            ))}
          </>
        )
    },
    {
      dataIndex: "deliveredDate",
      key: "deliveredDate",
      title: "Delivered Date",
      width: 200,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(formatTimeDayMonthYear(item))
    },
    {
      dataIndex: "drawingNumber",
      key: "drawingNumber",
      title: "Drawing Number",
      width: 200,
      sorter: true,
      showSorterTooltip: false,
      sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
      render: item => renderWithFallback(item)
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <Link
          to={ROUTES.VIEW_JOB_ITEM_DETAIL + `?tab=${MenuItem.majorlProject}`}
          state={{
            id: record.id,
            name: record.projectName,
            jobCodeAndPart: record.jobCodeAndPart,
            jobLocation: record.jobLocation,
            drawing: record.drawingNumber
          }}
        >
          View Job Items
        </Link>
      )
    }
  ];
  // #endregion

  const printDeliveryDocket = usePrintDeliveryDocketMutation(showToast);
  const handlePrintDeliveryDocket = (deliveryDocketNo: string) => {
    printDeliveryDocket.mutate(deliveryDocketNo);
  };
  // #endregion

  // #region Fetch Data
  const fetchJobsListData = useMutation<any, Error, IMajorProjectJobsList>({
    mutationFn: params => majorProjectsService.getMajorProjectJobsListDetails(params),
    onSuccess: (data: IMajorProjectJobDetailsResponse) => {
      if (data.meta.page === 1) {
        setLocalData(data.items);
        setDataResponse(data);
      } else {
        setLocalData(prevData => {
          const existingIds = new Set(prevData.map(item => item.id));
          const newItems = data.items.filter(item => !existingIds.has(item.id));
          return [...prevData, ...newItems];
        });
      }
      setDataLength(data.items.length);
      setPage(data.meta.page + 1);
      setHasNextPage(data.meta.hasNextPage);
      setTotalJobs(data.meta.totalRecords);
      setPageSize(data.meta.pageSize);
    },
    onError: error => {
      console.error("Failed to fetch jobs list data:", error);
      showToast(ToastType.error, somethingWentWrong);
    }
  });

  useEffect(() => {
    setPage(0);
    setLocalData([]);
    fetchJobsListData.mutate(initialJobsListPayload);
    getFilterMutation.mutate();
    getUiConfig.mutate();
  }, []);

  const visibleColumns = useMemo(() => {
    const selectedMap = new Map(uiConfig.filter(c => c.selected).map(c => [c.name, c]));

    const filtered = columns
      .filter(col => col.key !== undefined && selectedMap.has(String(col.key)))
      .sort((a, b) => {
        const orderA = selectedMap.get(String(a.key))?.order ?? 0;
        const orderB = selectedMap.get(String(b.key))?.order ?? 0;
        return orderA - orderB;
      });

    const actionColumn = columns.find(col => col.key === "action");
    if (actionColumn) {
      filtered.push(actionColumn);
    }
    return filtered;
  }, [columns, uiConfig]);
  // #endregion Fetch Data

  // #region Sort
  const handleCreateSorter = (_pagination: any, _filters: any, sorter: any) => {
    const { field, order } = sorter;
    request.search_text = search_text;
    if (order && field) {
      request.order_by = (
        Object.keys({ [field]: order === "ascend" ? sortASC : sortDESC }).length > 0
          ? JSON.stringify({ [field]: order === "ascend" ? sortASC : sortDESC })
          : undefined
      ) as any;
    }
    setOrderBy(request.order_by);
    fetchJobsListData.mutate(request);
  };
  // #endregion Sort

  // #region Filter
  // Fetch filter data
  const getFilterMutation = useMutation({
    mutationFn: () => majorProjectsService.getFilterDataJobList({ projectId__in: [dataHeader.id] }),
    onSuccess: (data: IJobsListFilterOptions) => {
      setFilter(data);
      setSelectedJobLocations(data.jobLocations?.map(jobLocations => jobLocations.id) || []);
      setSelectedJobCodes(data.jobCodes?.map(jobCode => jobCode.id) || []);
      setSelectedDrawingNumbers(data.drawingNumbers?.map(drawingNumber => drawingNumber.id) || []);
      setSelectedDeliveryDocket(data.deliveryNumbers?.map(deliveryNumber => deliveryNumber.id) || []);
      setSelectedJobStatus(data.statuses?.map(status => status.id) || []);
    }
  });

  const request = {
    projectId__in: [dataHeader.id],
    search_text: search_text,
    status__in: selectedJobStatus.length === filter?.statuses.length ? [] : selectedJobStatus,
    deliveryNumbers__in: selectedDeliveryDocket.length === filter?.deliveryNumbers.length ? [] : selectedDeliveryDocket,
    drawingNumber__in: selectedDrawingNumbers.length === filter?.drawingNumbers.length ? [] : selectedDrawingNumbers,
    jobCodeAndPart__in: selectedJobCodes.length === filter?.jobCodes.length ? [] : selectedJobCodes,
    jobLocation__in: selectedJobLocations.length === filter?.jobLocations.length ? [] : selectedJobLocations,
    page: 1,
    pageSize: pageSize,
    order_by: orderBy
  };

  const handleApplyFilter = () => {
    fetchJobsListData.mutate(request);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedJobStatus(filter?.statuses.map(e => e.id));
    setSelectedDeliveryDocket(filter?.deliveryNumbers.map(e => e.id));
    setSelectedDrawingNumbers(filter?.drawingNumbers.map(e => e.id));
    setSelectedJobCodes(filter?.jobCodes.map(e => e.id));
    setSelectedJobLocations(filter?.jobLocations.map(e => e.id));

    request.search_text = "";
    request.deliveryNumbers__in = [];
    request.status__in = [];
    request.jobCodeAndPart__in = [];
    request.jobLocation__in = [];
    request.drawingNumber__in = [];
    request.page = 1;
    fetchJobsListData.mutate(request);
  };

  const renderFilterOptions = () => {
    if (!filter) return null;
    return (
      <div className="relative my-5 bg-[#FAFAFA] rounded-md transition-all duration-300 border border-gray-200">
        <div
          className={`transition-all ${isFilterVisible ? "overflow-visible" : "overflow-hidden"} ${isFilterVisible ? "max-h-[155px] mb-1" : "max-h-10"}`}
        >
          <div className="wrapper w-full inline-flex gap-3 bg-[#FAFAFA] rounded-md">
            <div className={`content-wrapper w-full m-3 ${!isFilterVisible ? "mt-10" : ""}`}>
              <div className="first-line-filter grid grid-cols-3 gap-4">
                <div className="flex-1/3">
                  <DropdownSelector
                    title="Job Location"
                    options={filter.jobLocations}
                    selected={selectedJobLocations}
                    onSelect={setSelectedJobLocations}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title="Drawing Number"
                    options={filter.drawingNumbers}
                    selected={selectedDrawingNumbers}
                    onSelect={setSelectedDrawingNumbers}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title="Job Status"
                    options={filter.statuses}
                    selected={selectedJobStatus}
                    onSelect={setSelectedJobStatus}
                    canSearch={false}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector title="Job Code" options={filter.jobCodes} selected={selectedJobCodes} onSelect={setSelectedJobCodes} />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title="Delivery Docket"
                    options={filter.deliveryNumbers}
                    selected={selectedDeliveryDocket}
                    onSelect={setSelectedDeliveryDocket}
                  />
                </div>
                <div className="button-combination flex-1/5">
                  <div className="w-1/2 flex gap-2 items-center h-full">
                    <Button
                      className="!text-gray-900 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                      onClick={handleClearFilters}
                    >
                      {textClear}
                    </Button>
                    <Button
                      className="!text-orange-600 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                      onClick={handleApplyFilter}
                    >
                      {textApply}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 z-1 flex flex-col items-center">
          {!isFilterVisible && <span className="font-semibold mb-1">{textFilters}</span>}
          <Button
            onClick={() => setIsFilterVisible(prev => !prev)}
            className="!w-[24px] !h-[24px] !p-0 !rounded-full !bg-orange-500 !text-white !flex !items-center !justify-center !shadow-lg !hover:bg-orange-500 !transition-all"
          >
            {isFilterVisible ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
          </Button>
        </div>
      </div>
    );
  };
  // #endregion Filter

  // #region UI Config
  const getUiConfig = useMutation({
    mutationFn: () => majorProjectService.getUiConfig(),
    onSuccess: (data: any) => {
      const columnsConfig = data.columns;
      setUIConfig(columnsConfig);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const columnsUIConfig = columns.filter(column => column.key !== "id" && column.key !== "action");
  // #endregion UI Config

  // #region Lazy Loading
  const handleLoadMore = () => {
    if (!hasNextPage || fetchJobsListData.isPending) return;
    const nextPagePayload: IMajorProjectJobsList = {
      page: page,
      pageSize: 20,
      projectId__in: [dataHeader.id],
      order_by: orderBy
    };

    fetchJobsListData.mutate(nextPagePayload);
  };
  // #endregion Lazy Loading

  // #region Export CSV
  const downloadFile = (data: any, fileName: string) => {
    const href = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const exportCSV = useMutation({
    mutationFn: majorProjectsService.exportCSV,
    onSuccess: (response: any) => {
      downloadFile(response.data, exportFileName);
      showToast(ToastType.success, txtExportCSVSuccessfully);
    }
  });

  const handleExportCSV = async () => {
    const payload: IExportCSV = {
      projectId__in: [dataHeader.id]
    };
    exportCSV.mutate(payload);
  };
  // #endregion Export CSV

  // #region Render Desktop
  const renderDesktopLayout = () => {
    return (
      <div className="ml-8 mt-6 mr-8">
        <div className="flex items-center">
          <div
            className="bg-white rounded-md w-8 h-8 justify-center items-center border-gray-300 border-1 flex cursor-pointer"
            onClick={() => history.back()}
          >
            <img src={Images.IconBack} alt="back" className="cursor-pointer" />
          </div>
          <div className="text-xl font-semibold pl-3">{tabTitle}</div>
        </div>
        {/* Render Header */}
        <div className="wrapper w-full inline-flex my-2 bg-[#FAFAFA] rounded-md mt-5">
          <div className="content=wrapper w-full m-3 z-50">
            <div className="first-line-filter flex">
              <div className="flex-1/3 w-full text-gray-500 text-base">
                Project Name
                <div className="font-semibold text-black text-base">{dataHeader.name}</div>
              </div>
              <div className="flex-1/3 w-full text-gray-500 text-base">
                Project ID
                <div className="font-semibold text-black text-base">{dataHeader.projectId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <SearchBox
          searchInputValue={search_text ?? ""}
          setSearchInputValue={setSearchText}
          handleFilterData={handleApplyFilter}
          isUiConfig={true}
          columnsUIConfig={columnsUIConfig}
          selectedColumns={visibleColumns}
        />

        {/* Filter */}
        {renderFilterOptions()}

        {/* Table Header */}
        <Flex justify="space-between" align="flex-start">
          <div className="text-black font-semibold">{totalJobs} total jobs</div>
          <Button
            disabled={totalJobs === 0 || visibleColumns.length === 1}
            className="!text-orange-600 disabled:opacity-50 !rounded-md !px-2 !py-1 !space-x-1 !border !border-gray-300 !cursor-pointer !font-semibold !inline-flex !justify-end !items-center"
            onClick={handleExportCSV}
          >
            {textExportCSV}
          </Button>
        </Flex>

        {/* Table */}
        <BaseTable
          columns={visibleColumns.length > 1 ? visibleColumns : []}
          dataSource={localData}
          style={{ marginTop: 12 }}
          pagination={false}
          scroll={{ x: "max-content", y: 449 }}
          rowKey="id"
          onLoadMore={handleLoadMore}
          onChange={handleCreateSorter}
          loading={fetchJobsListData.isPending}
        />
      </div>
    );
  };
  // #endregion Render Desktop

  // #region Render Mobile
  const MobileLayout = () => {
    const buildMobileHeader = () => (
      <div>
        <div className="self-stretch justify-between items-center inline-flex overflow-hidden w-full pl-2 mt-6 pr-3">
          <div className="flex self-stretch relative justify-start items-center">
            <div className="w-8 h-8 justify-center items-center flex" onClick={() => history.back()}>
              <img src={Images.IconBack} alt="back" />
            </div>
            <div className="text-base pl-2 items-start text-gray-900 flex justify-start font-bold">{tabTitleMobile}</div>
          </div>

          <Button
            icon={<img src={Images.IconDownload} alt="downloadCSV" />}
            className="text-white rounded-md border border-gray-300 cursor-pointer inline-flex justify-end items-start"
            style={{ backgroundColor: THEME.COLORS.ORANGE_600, height: "32px" }}
            onClick={handleExportCSV}
          >
            {textCSV}
          </Button>
        </div>
        <div className="bg-gray-50 mt-[18px] p-3">
          <div className="flex">
            <div className="w-1/2 text-gray-500 text-[12px]">
              Project
              <div className="text-gray-900 text-[14px] mt-1 font-semibold">{dataHeader.name}</div>
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/2 text-gray-500 text-[12px]">
              Project ID
              <div className="text-gray-900 text-[14px] mt-1 font-semibold">{dataHeader.projectId}</div>
            </div>
          </div>
        </div>
      </div>
    );

    const buildMobileFilterSection = () => (
      <div className="flex h-10 gap-3 mt-5 ml-3 mr-3">
        <Input
          placeholder={searchPlaceHolderMajorProjectsJobsList}
          prefix={<SearchOutlined />}
          style={{ height: "40px" }}
          value={search_text}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={() => {
            handleApplyFilter();
          }}
        />
        <Button
          icon={<img src={Images.IconFilter} alt="filter" />}
          className="rounded-md border border-gray-300 cursor-pointer"
          style={{
            height: "40px",
            width: "40px",
            color: THEME.COLORS.PRIMARY
          }}
          onClick={() => setFiltersModalVisible(true)}
        ></Button>
      </div>
    );

    const itemCard = (items: IMajorProjectJobDetails) => {
      return <ViewJobsListDetailItemCard item={items} handlePrintDeliveryDocket={handlePrintDeliveryDocket} />;
    };

    const buildMobileTable = () => {
      return (
        <div id="scrollableDiv">
          <InfiniteScroll
            next={handleLoadMore}
            hasMore={hasNextPage}
            dataLength={dataLength}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          >
            <List
              split={false}
              itemLayout="horizontal"
              dataSource={localData}
              locale={{
                emptyText: <EmptyBox loading={false} />
              }}
              renderItem={item => <List.Item key={item.id}>{itemCard(item)}</List.Item>}
            />
            <LoadingComponent isPending={exportCSV.isPending || fetchJobsListData.isPending} />
          </InfiniteScroll>
        </div>
      );
    };

    return (
      <div>
        {buildMobileHeader()}
        {buildMobileFilterSection()}
        <div className="flex w-full justify-between items-center ml-3 mb-3 mt-[24px]">
          <div className="text-black font-light text-sm">{totalJobs} jobs</div>
        </div>
        {buildMobileTable()}
        <JobsListFiltersMobile
          isVisible={isFiltersModalVisible}
          onCancel={() => setFiltersModalVisible(false)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilter}
        />
      </div>
    );
    // #endregion Render Mobile
  };
  return isMobile ? MobileLayout() : renderDesktopLayout();
};

export default MajorProjectJobsList;
