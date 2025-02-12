import { create } from "zustand";

import { persist } from "zustand/middleware";

import { AuthState, User } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user: User | null, token: string | null) =>
        set({ user, token }),

      // isAuthenticated getter
      isAuthenticated: () => {
        const state = get();
        return Boolean(state.token && state.user);
      },

      // logout with optional callback
      logout: (callback?: () => void) => {
        set({ user: null, token: null });
        callback?.();
      },

      // method to update user data
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // method to refresh token
      updateToken: (newToken: string) => set({ token: newToken }),
    }),
    {
      name: "auth-storage",
      // control what gets persisted
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
