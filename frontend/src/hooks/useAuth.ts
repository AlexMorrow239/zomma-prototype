import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/authStore";

import { useApiMutation, useApiQuery } from "./useApi";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();

  const loginMutation = useApiMutation<LoginResponse, LoginCredentials>(
    "/auth/login",
    {
      onSuccess: (data) => {
        setAuth(data.user, data.token);
        queryClient.setQueryData(["user"], data.user);
      },
    }
  );

  const logoutMutation = useApiMutation<void, void>("/auth/logout", {
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
    },
  });

  const { data: currentUser, isLoading: isLoadingUser } = useApiQuery<
    LoginResponse["user"]
  >("/auth/me", {
    enabled: !!token,
    retry: false,
    queryKey: ["user"],
    onError: () => storeLogout(),
  });

  return {
    user: currentUser || user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}
