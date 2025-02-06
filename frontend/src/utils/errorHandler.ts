import { type AxiosError } from "axios";

import { useUIStore } from "@/stores/uiStore";

interface ErrorResponse {
  message: string;
  code?: string;
}

export const handleError = (error: Error | AxiosError): void => {
  const { addToast } = useUIStore.getState();

  if ("isAxiosError" in error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message =
      axiosError.response?.data?.message || "An unexpected error occurred";
    addToast({
      type: "error",
      message,
      duration: 5000,
    });
  } else {
    addToast({
      type: "error",
      message: error.message || "An unexpected error occurred",
      duration: 5000,
    });
  }

  // Optionally log to error tracking service
  console.error(error);
};
