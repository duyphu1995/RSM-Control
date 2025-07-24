import React from "react";
import { Images } from "@/constants/images.tsx";

interface ExportCSVModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  totalRecords: number;
}

export const ExportCSVModal: React.FC<ExportCSVModalProps> = ({ onConfirm, onCancel, totalRecords }) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[350px] text-left relative">
        <h3 className="text-lg font-semibold mb-4">Export to CSV</h3>

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 rounded-full p-4">
            <img src={Images.IconCsvMobile} alt="CSV" className="w-8 h-8" />
          </div>
        </div>

        <p className="mb-6 text-center">
          <span className="font-semibold">{totalRecords} records</span> will be exported based on your current filters.
        </p>

        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="border border-gray-300 rounded-md px-4 py-2 text-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-orange-500 text-white rounded-md px-4 py-2">
            Export
          </button>
        </div>

        <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <img src={Images.IconX} alt="Close" />
        </button>
      </div>
    </div>
  );
};
