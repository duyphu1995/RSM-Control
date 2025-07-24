import { Breadcrumb as AntBreadcrumb, BreadcrumbProps } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import ChevronIcon from "@/assets/chevron-left-gray.svg";

// Extend the BreadcrumbItemType to include an optional state property
interface BreadcrumbItemType extends ItemType {
  state?: any;
}

interface IBaseBreadcrumbProps<T extends AnyObject> extends BreadcrumbProps<T> {
  dataItem: BreadcrumbItemType[];
}

const BaseBreadcrumb = <T extends AnyObject>(props: IBaseBreadcrumbProps<T>) => {
  const { dataItem, ...otherProps } = props;

  const itemRender = (route: BreadcrumbItemType, _params: T, items: BreadcrumbItemType[]): ReactNode => {
    if (items.indexOf(route) === items.length - 1) {
      return <span>{route.title}</span>;
    } else {
      if (route.path) {
        return (
          <Link to={route.path} state={route.state}>
            {route.title}
          </Link>
        );
      }
      if (route.href) {
        return <a href={route.href}>{route.title}</a>;
      }
      return <span>{route.title}</span>;
    }
  };

  return (
    <AntBreadcrumb
      className="breadcrumb"
      itemRender={itemRender}
      separator={<img src={ChevronIcon} alt="breadcrumb separator" />}
      items={dataItem}
      {...otherProps}
    />
  );
};

export default BaseBreadcrumb;
