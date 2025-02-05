import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ToastType } from "@/types";

interface UiState {
  toasts: ToastType[];
}

const initialState: UiState = {
  toasts: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastType>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;