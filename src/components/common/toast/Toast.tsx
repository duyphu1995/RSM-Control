// src/components/common/Toast/Toast.tsx
import React, { useEffect, useState } from "react";
import "./toast.css";
import { Images } from "@/constants/images.tsx"; // Adjust path

export enum ToastType {
  success = "success",
  error = "error"
}

interface ToastProps {
  id: string; // Unique ID for each toast
  type: ToastType;
  message: string;
  duration?: number; // Optional: auto-hide duration in ms, 0 for no auto-hide
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Give some time for exit animation before calling onClose
        setTimeout(() => onClose(id), 300); // 300ms for fade-out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleCloseClick = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // 300ms for fade-out animation
  };

  const toastClass = `toast-container ${type.valueOf()} ${isVisible ? "show" : "hide"}`;
  const iconSrc = type === ToastType.success ? Images.IconToastSuccessed : Images.IconToastFailed; // Use appropriate icons
  const altText = type === ToastType.success ? "Success Icon" : "Error Icon";

  return (
    <div className={toastClass}>
      <div className="toast-icon">
        <img src={iconSrc} alt={altText} />
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close-button" onClick={handleCloseClick}>
        <img src={Images.IconX} alt="Close" />
      </button>
    </div>
  );
};

export default Toast;
