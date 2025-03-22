import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/authStore";
import { LoginCredentials, LoginResponse } from "@/types";

import { useApiMutation, useApiQuery } from "./useApi";

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
  });

  // Update query cache with the custom key when user data is fetched
  useEffect(() => {
    if (currentUser) {
      queryClient.setQueryData(["user"], currentUser);
    }
  }, [currentUser, queryClient]);

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
