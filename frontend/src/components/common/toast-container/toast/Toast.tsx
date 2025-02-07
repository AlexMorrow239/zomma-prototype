import { useState } from "react";

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import "./Toast.scss";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 200);
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`toast toast--${type} ${isExiting ? "toast--exit" : ""}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Icon className="toast__icon" aria-hidden="true" />
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
