import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptors
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    // Handle network errors
    if (!error.response) {
      throw new Error("Network error occurred. Please check your connection.");
    }

    // Handle API errors with proper error message extraction
    const errorMessage =
      (error.response?.data as { message?: string; error?: string })?.message ||
      (error.response?.data as { message?: string; error?: string })?.error ||
      "An unexpected error occurred";

    throw new Error(errorMessage);
  }
);

// Enhanced fetchApi function using axios
async function fetchApi<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  console.log("[fetchApi] Received options:", options);
  console.log("[fetchApi] Request data:", options.data);
  try {
    const config = {
      url: endpoint,
      ...options,
      data: options.data || undefined,
    };
    console.log("[fetchApi] Final axios config:", config);

    const response = await axiosInstance.request(config);
    console.log("[fetchApi] Response:", response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
    throw error;
  }
}

export function useApiQuery<T>(
  endpoint: string,
  options?: Omit<
    UseQueryOptions<T, AxiosError, T, readonly [string]>,
    "queryKey" | "queryFn"
  > & {
    axiosConfig?: AxiosRequestConfig;
    useGlobalLoader?: boolean;
  }
) {
  const {
    axiosConfig,
    useGlobalLoader = true,
    ...queryOptions
  } = options || {};
  const setLoading = useLoadingStore((state) => state.setLoading);

  // wrapped queryFn that handles loading state
  const wrappedQueryFn = async () => {
    if (useGlobalLoader) {
      setLoading(true);
    }
    try {
      const result = await fetchApi<T>(endpoint, axiosConfig);
      return result;
    } finally {
      if (useGlobalLoader) {
        setLoading(false);
      }
    }
  };

  return useQuery<T, AxiosError, T, readonly [string]>({
    queryKey: [endpoint],
    queryFn: wrappedQueryFn,
    ...queryOptions,
  });
}

export function useApiMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn"> & {
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    axiosConfig?: Omit<AxiosRequestConfig, "method" | "data">;
    useGlobalLoader?: boolean;
  }
) {
  const {
    method = "POST",
    axiosConfig,
    useGlobalLoader = true,
    ...mutationOptions
  } = options || {};
  const setLoading = useLoadingStore((state) => state.setLoading);

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => {
      console.log("[useApiMutation] Endpoint:", endpoint);
      console.log("[useApiMutation] Method:", method);
      console.log("[useApiMutation] Variables:", variables);
      console.log("[useApiMutation] Additional config:", axiosConfig);

      return fetchApi<TData>(endpoint, {
        method,
        data: variables,
        ...axiosConfig,
      });
    },
    ...mutationOptions,
    onSettled: (data, error, variables, context) => {
      if (useGlobalLoader) {
        setLoading(false);
      }
      mutationOptions?.onSettled?.(data, error, variables, context);
    },
    onMutate: (variables) => {
      if (useGlobalLoader) {
        setLoading(true);
      }
      mutationOptions?.onMutate?.(variables);
    },
  });
}
