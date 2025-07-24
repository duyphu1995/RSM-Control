import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./loading_spinner.css";
import React from "react";

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

interface LoadingSpinnerProps {
  isPending: boolean;
}

const LoadingComponent: React.FC<LoadingSpinnerProps> = ({ isPending }) => {
  if (!isPending) {
    return null;
  }
  return (
    <div className="spinner">
      <Spin spinning={isPending} indicator={antIcon} size="large" />
    </div>
  );
};

export default LoadingComponent;
