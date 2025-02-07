import { type ReactElement } from "react";

import { useUIStore } from "@/stores/uiStore";

import { Toast } from "./toast/Toast";
import "./ToastContainer.scss";

export function ToastContainer(): ReactElement {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
