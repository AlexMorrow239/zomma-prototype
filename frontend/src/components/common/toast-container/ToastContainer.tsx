import { useUIStore } from "@/stores/uiStore";
import type { ToastType } from "@/types";

import { Toast } from "./toast/Toast";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="toast-container">
      {toasts.map((toast: ToastType) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};
