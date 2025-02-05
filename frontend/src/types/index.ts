export interface ToastType {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}