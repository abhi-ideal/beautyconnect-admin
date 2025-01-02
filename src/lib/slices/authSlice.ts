"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  isLoading: true,
  isAuthenticated: false,
  user: null
};

const authSlice: any = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state: any, action: any) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    updateUserInfo: (state: any, action: any) => {
      state.user = action.payload;
    },
    logoutUser: (state: any) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state: any, action: any) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setUser, updateUserInfo, setLoading, logoutUser } =
  authSlice.actions;
export default authSlice.reducer;
