import { Modal } from "antd";
import CommonButton from "@/components/common/button/CommonButton.tsx";
import React from "react";
import { THEME } from "@/constants";

interface WarningDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonColor: string;
  onClose: () => void;
  width?: string;
}

export const WarningDialog: React.FC<WarningDialogProps> = ({ isOpen, title, message, width, confirmButtonText, onClose }) => {
  const handleConfirm = () => {
    onClose();
  };

  return (
    <Modal open={isOpen} title={title} width={width} closeIcon={null} footer={null} centered>
      <p className="font-normal text-[14px] text-gray-700">{message}</p>
      <div className="flex flex-col justify-center pt-[30px]">
        <CommonButton label={confirmButtonText} onClick={handleConfirm} backgroundColor={THEME.COLORS.DANGER} />
      </div>
    </Modal>
  );
};
