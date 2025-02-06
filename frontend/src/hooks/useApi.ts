import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/authStore";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Enhanced fetchApi function using axios
async function fetchApi<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });
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
  options?: UseQueryOptions<T, Error, T, readonly [string]> & {
    axiosConfig?: AxiosRequestConfig;
  }
) {
  const { axiosConfig, ...queryOptions } = options || {};

  return useQuery<T, Error, T, readonly [string]>({
    queryKey: [endpoint],
    queryFn: () => fetchApi<T>(endpoint, axiosConfig),
    ...queryOptions,
  });
}

export function useApiMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn"> & {
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    axiosConfig?: Omit<AxiosRequestConfig, "method" | "data">;
  }
) {
  const { method = "POST", axiosConfig, ...mutationOptions } = options || {};

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) =>
      fetchApi<TData>(endpoint, {
        method,
        data: variables,
        ...axiosConfig,
      }),
    ...mutationOptions,
  });
}
