import { AxiosError } from "axios";

import { useUIStore } from "@/stores/uiStore";
import { ApiError } from "@/types";

type ErrorResponse = {
  message?: string;
  error?: ApiError;
};

export const handleError = (error: Error | AxiosError): void => {
  const { addToast } = useUIStore.getState();

  if ("isAxiosError" in error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    // Get the error message from various possible sources
    const message =
      // First try to get the error message from the response data
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error?.message ||
      // Then try the axios error message
      axiosError.message ||
      // Finally, provide specific messages based on status codes
      (axiosError.response?.status === 400
        ? "Invalid request"
        : axiosError.response?.status === 401
          ? "Please log in to continue"
          : axiosError.response?.status === 403
            ? "You don't have permission to perform this action"
            : axiosError.response?.status === 404
              ? "The requested resource was not found"
              : axiosError.response?.status === 422
                ? "Invalid input data"
                : axiosError.response?.status === 429
                  ? "Too many requests. Please try again later"
                  : (axiosError.response?.status ?? 0) >= 500
                    ? "Server error. Please try again later"
                    : "An unexpected error occurred");

    addToast({
      type: "error",
      message,
      // Longer duration for error messages to ensure they're read
      duration: 7000,
    });

    // Log the full error details to console in development
    if (process.env.NODE_ENV === "development") {
      console.group("API Error Details");
      console.error("Status:", axiosError.response?.status);
      console.error("Message:", message);
      console.error("Response Data:", axiosError.response?.data);
      console.error("Full Error:", axiosError);
      console.groupEnd();
    }
  } else {
    // Handle non-Axios errors
    const message = error.message || "An unexpected error occurred";

    addToast({
      type: "error",
      message,
      duration: 7000,
    });

    // Log the error in development
    if (process.env.NODE_ENV === "development") {
      console.group("Application Error");
      console.error("Message:", message);
      console.error("Full Error:", error);
      console.groupEnd();
    }
  }

  // Here you could also integrate with error tracking services like Sentry
  // if (process.env.NODE_ENV === "production") {
  //   Sentry.captureException(error);
  // }
};

// Helper function to create a user-friendly error message from validation errors
export const formatValidationErrors = (
  details: Record<string, string[]>
): string => {
  const errors = Object.entries(details)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("; ");

  return errors || "Invalid input data";
};

// Optional: Export a type-safe toast helper
export const showErrorToast = (message: string): void => {
  const { addToast } = useUIStore.getState();
  addToast({
    type: "error",
    message,
    duration: 7000,
  });
};
