import React, { createContext, ReactNode, useCallback, useContext, useState, useRef } from "react";
import Toast, { ToastType } from "@/components/common/toast/Toast.tsx";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<{ id: string; type: ToastType; message: string; duration?: number } | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 3000) => {
      if (currentToast) {
        return;
      }

      const id = Date.now().toString();
      setCurrentToast({ id, type, message, duration });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCurrentToast(null);
      }, duration);
    },
    [currentToast]
  );

  const handleCloseToast = useCallback(() => {
    setCurrentToast(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-portal">
        {currentToast && (
          <Toast
            key={currentToast.id}
            id={currentToast.id}
            type={currentToast.type}
            message={currentToast.message}
            duration={currentToast.duration}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
