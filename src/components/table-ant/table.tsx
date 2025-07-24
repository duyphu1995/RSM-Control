import { Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { TableProps } from "antd/es/table";
import { TableLocale } from "antd/es/table/interface";
import EmptyBox from "../empty-box";
import "./table.css";

export interface IBaseTableProps<T> extends TableProps<T> {
  dataSource?: T[];
  rowClassName?: (record: T, index: number) => string;
  pageSizeMax?: boolean;
  paginationTable?: {
    currentPage: number;
    pageSize: number;
    onChange: (currentPage: number, pageSize: number) => void;
  };
  onLoadMore: () => void;
}

const BaseTable = <T extends AnyObject>(props: IBaseTableProps<T>) => {
  const { scroll: scrollProp, locale: localeProp, rowClassName: rowClassNameProp, paginationTable, dataSource, pageSizeMax, ...otherProps } = props;

  // Locale
  const localeDefault: TableLocale = { emptyText: <EmptyBox loading={false} imageSize={120} minHeight={400} /> };
  const locale = localeProp ?? localeDefault;

  // Scroll
  const scrollDefault = { x: "max-content", y: dataSource && dataSource?.length >= 15 ? Math.floor(window.innerHeight * 0.6) : undefined };
  const scroll = scrollProp ?? scrollDefault;

  // Row class name
  const rowClassNameDefault = (_: T, index: number) => (index % 2 === 0 ? "table-row-light" : "table-row-dark");
  const rowClassName = rowClassNameProp ?? rowClassNameDefault;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 1;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (isNearBottom) {
      props.onLoadMore();
    }
  };

  return (
    <Table
      className="base-table"
      {...otherProps}
      bordered={true}
      dataSource={dataSource}
      scroll={scroll}
      locale={locale}
      showSorterTooltip={false}
      rowClassName={rowClassName}
      onScroll={handleScroll}
      pagination={false}
    />
  );
};

export default BaseTable;
