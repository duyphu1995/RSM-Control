import React, { useEffect, useMemo, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive.ts";
import { Images } from "@/constants/images.tsx";
import {
  deliveryDocket,
  downloadCSVSuccessfully,
  projectItemDetailMobilePageHeader,
  projectItemDetailPageHeader,
  searchByPieceNumber,
  textApply,
  textClear,
  textCSV,
  textDeliveredDate,
  textDeliveredQty,
  textDeliveryDocket,
  textDescription,
  textDrawingNumber,
  textExportCSV,
  textFilters,
  textItemStatus,
  textJobCode,
  textJobLocation,
  textLocation,
  textPieceNumber,
  textProject,
  textProjectId,
  textQuantity,
  textReadyDate,
  textReadyQty,
  textStatus,
  textTotalItems,
  textUIConfig
} from "@/constants/strings.ts";
import { useShallow } from "zustand/shallow";
import { Button, Input, List, Skeleton } from "antd";
import { DropdownSelector } from "@/components/dropdown/DropDown.tsx";
import { THEME } from "@/constants";
import BaseTable from "@/components/table-ant/table.tsx";
import { ColumnType } from "antd/es/table";
import { renderWithFallback } from "@/components/table-ant/render-table-common";
import { useMutation } from "@tanstack/react-query";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { ErrorResponse } from "@/services/api.ts";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { statusColors } from "@/utils/statusUtils";
import { format } from "date-fns";
import { ddMMyyFormat, FILE_NAME_DEFAULT, fileNameBlobRegex, sortASC, sortDESC, stringEmDash, UIConfigTypes } from "@/constants/app_constants.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { UIConfigModal } from "@/components/UIConfigModal";
import { ProjectItemModel, useViewProjectItemDetailStore } from "@/stores/viewProjectItemDetailStore.ts";
import {
  GetViewProjectItemDetailResponse,
  GetViewProjectItemUIConfigResponse,
  ViewProjectItemDetailFilterResponse,
  viewProjectItemDetailService
} from "@/services/viewProjectItemDetailService";
import { ViewProjectItemDetailItemCard } from "@/layouts/view_project_item_detail/ViewProjectItemDetailItemCard.tsx";
import { ViewProjectItemDetailItemFiltersModal } from "@/layouts/view_project_item_detail/ViewProjectItemDetailFilter.tsx";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePrintDeliveryDocketMutation } from "@/utils/printDeliveryUtil.ts";
import { SortIcon } from "@/components/common/SortIcon.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import EmptyBox from "@/components/empty-box";

export const ViewProjectItemDetailPage: React.FC = () => {
  const { isMobile } = useResponsive();
  const params = useLocation().state;
  const projectId = params.id;
  const projectNameData = params.name;
  const displayProjectId = params.projectId;
  const { showToast } = useToast();
  const {
    data,
    setData,
    filters,
    setFilters,
    selectedStatus,
    setSelectedStatus,
    selectedDeliveryDocket,
    setSelectedDeliveryDocket,
    selectedDrawingNumbers,
    setSelectedDrawingNumbers,
    selectedJobCodes,
    setSelectedJobCodes,
    selectedJobLocations,
    setSelectedJobLocations,
    searchKey,
    setSearchKey,
    uiConfig,
    setUIConfig,
    sortModel,
    setSortModel,
    initialData,
    setIsLoadMore
  } = useViewProjectItemDetailStore(
    useShallow(state => ({
      data: state.data,
      setData: state.setData,
      filters: state.filters,
      setFilters: state.setFilter,
      selectedStatus: state.selectedStatus,
      setSelectedStatus: state.setSelectedStatus,
      selectedDeliveryDocket: state.selectedDeliveryDocket,
      setSelectedDeliveryDocket: state.setSelectedDeliveryDocket,
      selectedDrawingNumbers: state.selectedDrawingNumbers,
      setSelectedDrawingNumbers: state.setSelectedDrawingNumbers,
      selectedJobCodes: state.selectedJobCodes,
      setSelectedJobCodes: state.setSelectedJobCodes,
      selectedJobLocations: state.selectedJobLocations,
      setSelectedJobLocations: state.setSelectedJobLocations,
      searchKey: state.searchKey,
      setSearchKey: state.setSearchKey,
      uiConfig: state.uiConfig,
      setUIConfig: state.setUIConfig,
      sortModel: state.sortModel,
      setSortModel: state.setSortModel,
      initialData: state.initialData,
      setIsLoadMore: state.setIsLoadMore
    }))
  );
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [isUIConfigModalVisible, setIsUIConfigModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const request = {
    projectId__in: [projectId],
    search_text: searchKey,
    order_by: JSON.stringify({ [sortModel.columnKey]: sortModel.order }),
    status__in: selectedStatus.length === filters.statuses.length ? [] : selectedStatus,
    deliveryNumbers__in: selectedDeliveryDocket.length === filters.deliveryNumbers.length ? [] : selectedDeliveryDocket,
    drawingNumber__in: selectedDrawingNumbers.length === filters.drawingNumbers.length ? [] : selectedDrawingNumbers,
    jobCodeAndPart__in: selectedJobCodes.length === filters.jobCodes.length ? [] : selectedJobCodes,
    jobLocation__in: selectedJobLocations.length === filters.jobLocations.length ? [] : selectedJobLocations,
    page: data.meta.page,
    pageSize: data.meta.pageSize
  };

  useEffect(() => {
    clearMeta();
    setSearchKey("");
    setSortModel({
      order: sortASC,
      columnKey: "jobCodeAndPart"
    });
    getDataMutation.mutate({
      projectId__in: [projectId],
      order_by: JSON.stringify({ ["jobCodeAndPart"]: sortASC }),
      status__in: [],
      deliveryNumbers__in: [],
      drawingNumber__in: [],
      jobCodeAndPart__in: [],
      jobLocation__in: [],
      page: data.meta.page,
      pageSize: data.meta.pageSize
    });
    getFiltersMutation.mutate();
    getUIConfigMutation.mutate();
  }, []);

  const getFiltersMutation = useMutation({
    mutationFn: () =>
      viewProjectItemDetailService.getViewProjectItemDetailFilters({
        projectId__in: [params.id]
      }),
    onSuccess: (data: ViewProjectItemDetailFilterResponse) => {
      setFilters(data);
      setSelectedJobCodes(data.jobCodes?.map(jobCode => jobCode.id) || []);
      setSelectedJobLocations(data.jobLocations?.map(jobLocation => jobLocation.id) || []);
      setSelectedDrawingNumbers(data.drawingNumbers?.map(drawingNumber => drawingNumber.id) || []);
      setSelectedDeliveryDocket(data.deliveryNumbers?.map(deliveryNumber => deliveryNumber.id) || []);
      setSelectedStatus(data.statuses?.map(status => status.id) || []);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const getUIConfigMutation = useMutation({
    mutationFn: () => viewProjectItemDetailService.getViewProjectItemDetailUIConfig(),
    onSuccess: (data: GetViewProjectItemUIConfigResponse) => {
      setUIConfig(data.columns);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const downloadCSV = () => {
    const downloadRequest = {
      projectId__in: request.projectId__in,
      status__in: request.status__in,
      order_by: request.order_by,
      deliveryNumbers__in: request.deliveryNumbers__in,
      jobLocation__in: request.jobLocation__in,
      jobCodeAndPart__in: request.jobCodeAndPart__in,
      drawingNumber__in: request.drawingNumber__in,
      search_text: request.search_text
    };
    exportCSV.mutate(downloadRequest);
  };

  const exportCSV = useMutation({
    mutationFn: viewProjectItemDetailService.exportCSV,
    onSuccess: (data: any) => {
      const url = window.URL.createObjectURL(data.data);

      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = data.contentDisposition;

      let fileName = UIConfigTypes.majorProjectItem + FILE_NAME_DEFAULT;
      if (contentDisposition) {
        const match = contentDisposition.match(fileNameBlobRegex);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      showToast(ToastType.success, downloadCSVSuccessfully);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const handleSaveUIConfig = (selectedColumns: ColumnType<ProjectItemModel>[]) => {
    updateUIConfigMutation.mutate({
      configType: UIConfigTypes.majorProjectItem,
      columns: selectedColumns.map(col => String(col.key!)).filter(Boolean)
    });
    setIsUIConfigModalVisible(false);
  };

  const updateUIConfigMutation = useMutation({
    mutationFn: viewProjectItemDetailService.updateViewProjectItemDetailUIConfig,
    onSuccess: (data: GetViewProjectItemUIConfigResponse) => {
      setUIConfig(data.columns);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      clearMeta();
      getDataMutation.mutate(request);
    }
  };

  const handleClearFilters = () => {
    setSearchKey("");
    setSelectedStatus(filters.statuses.map(e => e.id));
    setSelectedDeliveryDocket(filters.deliveryNumbers.map(e => e.id));
    setSelectedJobCodes(filters.jobCodes.map(e => e.id));
    setSelectedJobLocations(filters.jobLocations.map(e => e.id));
    setSelectedDrawingNumbers(filters.drawingNumbers.map(e => e.id));

    request.search_text = "";
    request.deliveryNumbers__in = [];
    request.status__in = [];
    request.jobCodeAndPart__in = [];
    request.jobLocation__in = [];
    request.drawingNumber__in = [];
    clearMeta();
    getDataMutation.mutate(request);
  };

  const handleApplyFilters = () => {
    clearMeta();
    getDataMutation.mutate(request);
  };

  const getDataMutation = useMutation({
    mutationFn: viewProjectItemDetailService.getViewProjectItemDetail,
    onSuccess: (data: GetViewProjectItemDetailResponse) => {
      setData(data);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const clearMeta = () => {
    request.page = 1;
    request.pageSize = 20;
    setIsLoadMore(false);
    initialData();
  };

  const handleLoadMore = () => {
    if (!data.meta.hasNextPage) return;
    request.page = data.meta.page + 1;
    setIsLoadMore(true);
    getDataMutation.mutate(request);
  };

  const handleCreateSorter = (_pagination: any, _filters: any, sorter: any) => {
    const { field, order } = sorter;
    let sortDirection = sortModel.order === sortASC ? sortDESC : sortASC;

    let sortBy = { [sortModel.columnKey]: sortDirection };

    if (field && order) {
      sortDirection = order === "ascend" ? sortASC : sortDESC;
      sortBy = { [field]: sortDirection };
    }

    setSortModel({
      order: sortDirection,
      columnKey: sorter.columnKey ?? sortModel.columnKey
    });

    request.page = 1;
    request.order_by = Object.keys(sortBy).length > 0 ? JSON.stringify(sortBy) : JSON.stringify({ [sortModel.columnKey]: sortModel.order });
    setIsLoadMore(false);
    getDataMutation.mutate(request);
  };

  const printDeliveryDocket = usePrintDeliveryDocketMutation(showToast);
  const handlePrintDeliveryDocket = (deliveryDocketNo: string) => {
    printDeliveryDocket.mutate(deliveryDocketNo);
  };

  const buildHeader = (isMobile: boolean) => {
    return isMobile ? (
      <div className="self-stretch justify-between items-center inline-flex overflow-hidden w-full pl-2 mt-6 pr-3">
        <div className="flex self-stretch relative justify-start items-center">
          <div className="w-8 h-8 justify-center items-center flex cursor-pointer" onClick={() => history.back()}>
            <img src={Images.IconBack} alt="back" />
          </div>
          <h1 className="text-[16px] ml-2 items-start flex justify-start font-semibold">{projectItemDetailMobilePageHeader}</h1>
        </div>

        <Button
          disabled={data.meta.totalRecords === 0}
          icon={<img src={Images.IconDownload} alt="downloadCSV" />}
          className="text-orange-600 rounded-md border border-gray-300 cursor-pointer inline-flex justify-end items-start font-semibold"
          style={{
            height: "32px",
            color: THEME.COLORS.PRIMARY
          }}
          onClick={downloadCSV}
        >
          {textCSV}
        </Button>
      </div>
    ) : (
      <div className="flex items-center">
        <div
          className="bg-white rounded-md w-8 h-8 justify-center items-center border-gray-300 border-1 flex cursor-pointer"
          onClick={() => history.back()}
        >
          <img src={Images.IconBack} alt="back" />
        </div>
        <div className="flex items-center text-[20px] ml-2 font-semibold">{projectItemDetailPageHeader}</div>
      </div>
    );
  };

  const buildInformationSection = (isMobile: boolean) => {
    return isMobile ? (
      <div className="bg-gray-50 mt-[18px] p-3">
        <div className="flex">
          <div className="w-1/2 text-gray-500 text-[12px]">
            {textProject}
            <div className="text-gray-900 text-[14px] mt-1 font-semibold">{projectNameData ? projectNameData : stringEmDash}</div>
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/2 text-gray-500 text-[12px]">
            {textProjectId}
            <div className="text-gray-900 text-[14px] mt-1 font-semibold">{displayProjectId ? displayProjectId : stringEmDash}</div>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-[#FAFAFA] mt-5 rounded-lg p-4">
        <div className="flex">
          <div className="w-1/2 text-gray-500 text-[16px]">
            {textProject}
            <div className="text-gray-900 text-[16px] mt-1 font-semibold">{projectNameData ? projectNameData : stringEmDash}</div>
          </div>
          <div className="w-1/2 text-gray-500 text-[16px]">
            {textProjectId}
            <div className="text-gray-900 text-[16px] mt-1 font-semibold">{displayProjectId ? displayProjectId : stringEmDash}</div>
          </div>
        </div>
      </div>
    );
  };

  const buildSearchBoxSection = (isMobile: boolean) => {
    return isMobile ? (
      <div className="flex h-10 gap-2 mt-4 ml-3 mr-3">
        <Input
          placeholder={searchByPieceNumber}
          prefix={<img src={Images.IconSearch} alt="search" className="ml-1 mr-1" />}
          value={searchKey}
          onKeyDown={handleKeyDown}
          onChange={e => setSearchKey(e.target.value)}
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
    ) : (
      <div className="w-full flex gap-3 mt-5 h-10">
        <div className="w-full z-50">
          <div className="flex justify-between">
            <div className="flex flex-grow gap-3">
              <div className="flex flex-grow">
                <Input
                  placeholder={searchByPieceNumber}
                  prefix={<img src={Images.IconSearch} alt="search" className="ml-1 mr-1" />}
                  className="h-full w-full"
                  value={searchKey}
                  onKeyDown={handleKeyDown}
                  onChange={e => setSearchKey(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center h-10 ml-3">
              <Button
                className="!text-orange-600 !h-full rounded-md border border-gray-300 cursor-pointer !font-semibold text-sm"
                onClick={() => setIsUIConfigModalVisible(true)}
              >
                {textUIConfig}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const buildFilterSection = () => {
    return (
      <div className="relative my-5 transition-all duration-300 bg-[#FAFAFA] rounded-md border border-gray-200">
        <div
          className={`transition-all ${isFilterVisible ? "overflow-visible" : "overflow-hidden"} ${isFilterVisible ? "max-h-[155px] mb-1" : "max-h-10"}`}
        >
          <div className="wrapper w-full inline-flex gap-3 bg-[#FAFAFA] rounded-md">
            <div className={`content-wrapper w-full m-3 ${!isFilterVisible ? "mt-10" : ""}`}>
              <div className="first-line-filter grid grid-cols-3 gap-4">
                <div className="flex-1/3">
                  <DropdownSelector
                    title={textLocation}
                    options={filters.jobLocations}
                    selected={selectedJobLocations}
                    onSelect={setSelectedJobLocations}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title={textDrawingNumber}
                    options={filters.drawingNumbers}
                    selected={selectedDrawingNumbers}
                    onSelect={setSelectedDrawingNumbers}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title={textItemStatus}
                    options={filters.statuses}
                    selected={selectedStatus}
                    onSelect={setSelectedStatus}
                    canSearch={false}
                  />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector title={textJobCode} options={filters.jobCodes} selected={selectedJobCodes} onSelect={setSelectedJobCodes} />
                </div>
                <div className="flex-1/3">
                  <DropdownSelector
                    title={deliveryDocket}
                    options={filters.deliveryNumbers}
                    selected={selectedDeliveryDocket}
                    onSelect={setSelectedDeliveryDocket}
                  />
                </div>
                <div className="button-combination flex-1/5">
                  <div className="w-1/2 flex gap-2 items-center h-full">
                    <Button
                      className="!flex-1/2 !h-full !cursor-pointer !font-semibold text-gray-900 rounded-md border border-gray-300"
                      onClick={handleClearFilters}
                    >
                      {textClear}
                    </Button>
                    <Button
                      className="!text-orange-600 !flex-1/2 !rounded-md !border !border-gray-300 !h-full !cursor-pointer !font-semibold"
                      onClick={handleApplyFilters}
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
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="!w-[24px] !h-[24px] !p-0 !rounded-full !bg-orange-500 !text-white !flex !items-center !justify-center !shadow-lg !hover:bg-orange-500 !transition-all"
          >
            {isFilterVisible ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
          </Button>
        </div>
      </div>
    );
  };

  const tableHeader = (isMobile: boolean) =>
    isMobile ? (
      <div className="flex w-full justify-between items-center ml-3 mb-3 mt-6">
        <div className="text-gray-900 font-normal text-sm">
          {data.meta.totalRecords ?? 0} {textTotalItems}
        </div>
      </div>
    ) : (
      <div className="flex w-full justify-between items-center mb-3">
        <div className="text-gray-900 font-semibold text-sm">
          {data.meta.totalRecords ?? 0} {textTotalItems}
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={data.meta.totalRecords === 0 || visibleColumns.length === 0}
            className="!border disabled:opacity-50 !border-gray-300 !text-orange-500 !px-3 !py-[6px] !rounded-md !hover:bg-orange-100 !transition !text-sm !font-semibold"
            onClick={downloadCSV}
          >
            {textExportCSV}
          </Button>
        </div>
      </div>
    );

  const itemCard = (item: ProjectItemModel) => {
    return <ViewProjectItemDetailItemCard item={item} handlePrintDeliveryDocket={handlePrintDeliveryDocket} />;
  };

  const tableBody = (isMobile: boolean) => {
    return isMobile ? (
      <div id="scrollableDiv">
        <InfiniteScroll
          next={handleLoadMore}
          hasMore={data.meta.hasNextPage}
          dataLength={data.items.length}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        >
          <List
            key="id"
            split={false}
            locale={{
              emptyText: <EmptyBox loading={false} />
            }}
            itemLayout="horizontal"
            dataSource={data.items}
            renderItem={item => <List.Item style={{ paddingTop: "8px", paddingBottom: "8px" }}>{itemCard(item)}</List.Item>}
          />
        </InfiniteScroll>
      </div>
    ) : (
      <div>
        <div className="relative max-h-[600px] rounded-xl border border-gray-200">
          <BaseTable
            key="id"
            columns={visibleColumns}
            dataSource={data.items}
            onLoadMore={handleLoadMore}
            onChange={handleCreateSorter}
            loading={getDataMutation.isPending}
          />
        </div>
      </div>
    );
  };

  const getSortDirection = (name: string) => (sortModel.columnKey === name ? (sortModel.order === sortASC ? "ascend" : "descend") : null);

  const columns: ColumnType<ProjectItemModel>[] = useMemo(
    () => [
      {
        dataIndex: "jobCodeAndPart",
        key: "jobCodeAndPart",
        title: textJobCode,
        width: 160,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("jobCodeAndPart"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "pieceNo",
        key: "pieceNo",
        title: textPieceNumber,
        width: 160,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("pieceNo"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "quantity",
        key: "quantity",
        title: textQuantity,
        width: 146,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("quantity"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "itemReadyQty",
        key: "itemReadyQty",
        title: textReadyQty,
        width: 146,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("itemReadyQty"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "itemDeliveredQty",
        key: "itemDeliveredQty",
        title: textDeliveredQty,
        width: 160,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("itemDeliveredQty"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "status",
        key: "status",
        title: textStatus,
        width: 140,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("status"),
        sortDirections: ["ascend", "descend"],
        render: item => (
          <span style={{ backgroundColor: statusColors[item] }} className={`px-2 text-xs py-1 text-white rounded-2xl`}>
            {item}
          </span>
        )
      },
      {
        dataIndex: "description",
        key: "description",
        title: textDescription,
        width: 300,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("description"),
        sortDirections: ["ascend", "descend"],
        render: item => renderWithFallback(item)
      },
      {
        dataIndex: "itemReadyDate",
        key: "itemReadyDate",
        title: textReadyDate,
        width: 160,
        render: item => (item ? format(new Date(item), ddMMyyFormat) : stringEmDash),
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("itemReadyDate"),
        sortDirections: ["ascend", "descend"]
      },
      {
        dataIndex: "itemDeliveredDate",
        key: "itemDeliveredDate",
        title: textDeliveredDate,
        width: 160,
        render: item => (item ? format(new Date(item), ddMMyyFormat) : stringEmDash),
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("itemDeliveredDate"),
        sortDirections: ["ascend", "descend"]
      },
      {
        dataIndex: "deliveryNumbers",
        key: "deliveryNumbers",
        title: textDeliveryDocket,
        width: 170,
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("deliveryNumbers"),
        sortDirections: ["ascend", "descend"],
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
        dataIndex: "drawingNumber",
        key: "drawingNumber",
        title: textDrawingNumber,
        width: 180,
        render: item => renderWithFallback(item),
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("drawingNumber"),
        sortDirections: ["ascend", "descend"]
      },
      {
        dataIndex: "jobLocation",
        key: "jobLocation",
        title: textJobLocation,
        width: 200,
        render: item => renderWithFallback(item),
        sorter: true,
        sortIcon: ({ sortOrder }) => <SortIcon sortOrder={sortOrder} />,
        sortOrder: getSortDirection("jobLocation"),
        sortDirections: ["ascend", "descend"]
      }
    ],
    [sortModel]
  );

  const visibleColumns = useMemo(() => {
    const selectedMap = new Map(uiConfig.filter(c => c.selected).map(c => [c.name, c]));

    return columns
      .filter(col => col.key !== undefined && selectedMap.has(String(col.key)))
      .sort((a, b) => {
        const orderA = selectedMap.get(String(a.key))?.order ?? 0;
        const orderB = selectedMap.get(String(b.key))?.order ?? 0;
        return orderA - orderB;
      });
  }, [columns, uiConfig]);

  const desktopLayout = () => {
    return (
      <div className="ml-8 mt-6 mr-8">
        {buildHeader(false)}
        {buildInformationSection(false)}
        {buildSearchBoxSection(false)}
        {buildFilterSection()}
        {tableHeader(false)}
        {tableBody(false)}
        {isUIConfigModalVisible && (
          <UIConfigModal
            isShowUIConfigModal
            columns={columns}
            selectedColumns={visibleColumns ?? columns}
            onClose={() => setIsUIConfigModalVisible(false)}
            onSave={handleSaveUIConfig}
          />
        )}
        <LoadingComponent
          isPending={getFiltersMutation.isPending || getUIConfigMutation.isPending || updateUIConfigMutation.isPending || exportCSV.isPending}
        />
      </div>
    );
  };

  const mobileLayout = () => {
    return (
      <div>
        {buildHeader(true)}
        {buildInformationSection(true)}
        {buildSearchBoxSection(true)}
        {tableHeader(true)}
        {tableBody(true)}
        <ViewProjectItemDetailItemFiltersModal
          isVisible={isFiltersModalVisible}
          onCancel={() => setFiltersModalVisible(false)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />
        <LoadingComponent isPending={getFiltersMutation.isPending || exportCSV.isPending} />
      </div>
    );
  };

  return isMobile ? mobileLayout() : desktopLayout();
};
