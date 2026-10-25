import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authAsyncThunk } from "./authAsyncThunk";

export type AuthState = {
  userInfo: { success: boolean; user: AccountInfo } | undefined;
  isLoading: boolean;
};

const initialState: AuthState = {
  userInfo: undefined,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AccountInfo>) {
      state.userInfo = { success: true, user: action.payload };
    },
    clearUser(state) {
      state.userInfo = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authAsyncThunk.getMe.pending, (state) => {
      state.isLoading = true;
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(authAsyncThunk.getMe.rejected, (state) => {
      state.isLoading = false;
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.login.pending, (state) => {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.login.fulfilled, (state) => {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.login.rejected, (state) => {
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.logout.pending, (state) => {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.logout.fulfilled, (state) => {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.logout.rejected, (state) => {
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.exchangeCode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authAsyncThunk.exchangeCode.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(authAsyncThunk.exchangeCode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const authActions = { ...authSlice.actions };
export const authReducer = authSlice.reducer;
