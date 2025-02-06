import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Include cookies in requests
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

export function useApiQuery<T>(
  endpoint: string,
  options?: UseQueryOptions<T, Error, T, readonly [string]> & {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  return useQuery<T, Error, T, readonly [string]>({
    queryKey: [endpoint],
    queryFn: () => fetchApi<T>(endpoint),
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn"
  >
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) =>
      fetchApi<TData>(endpoint, {
        method: "POST",
        body: variables,
      }),
    ...options,
  });
}