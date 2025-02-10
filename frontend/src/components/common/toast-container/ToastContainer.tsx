import { type ReactElement } from "react";

import * as Toast from "@radix-ui/react-toast";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { useUIStore } from "@/stores/uiStore";

import "./ToastContainer.scss";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastContainer(): ReactElement {
  const { toasts, removeToast } = useUIStore();

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <Toast.Root
            key={toast.id}
            className={`toast toast--${toast.type}`}
            onOpenChange={(open) => !open && removeToast(toast.id)}
          >
            <Icon className="toast__icon" aria-hidden="true" />
            <Toast.Description className="toast__message">
              {toast.message}
            </Toast.Description>
            <Toast.Close
              className="toast__close"
              aria-label="Close notification"
            >
              <X size={16} />
            </Toast.Close>
          </Toast.Root>
        );
      })}
      <Toast.Viewport className="toast-container" />
    </Toast.Provider>
  );
}
