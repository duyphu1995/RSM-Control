import { Modal } from "antd";
import CommonButton from "@/components/common/button/CommonButton.tsx";
import { stringCancel } from "@/constants/strings.ts";
import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonColor: string;
  onClose: () => void;
  onConfirm: () => void;
  width?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  width,
  confirmButtonText,
  confirmButtonColor,
  onClose,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={isOpen} title={title} width={width} closeIcon={null} footer={null} centered>
      <p className="font-normal text-[14px] text-gray-700">{message}</p>
      <div className="flex flex-col justify-center pt-[30px]">
        <CommonButton label={confirmButtonText} onClick={handleConfirm} backgroundColor={confirmButtonColor} />
      </div>
      <div className="items-center justify-center flex pt-[10px]">
        <button onClick={onClose} className="cursor-pointer">
          {stringCancel}
        </button>
      </div>
    </Modal>
  );
};
