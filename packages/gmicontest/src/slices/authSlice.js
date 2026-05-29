import { createSlice } from '@reduxjs/toolkit'
import { authAsyncThunk } from "./authAsyncThunk";

export const authSlice = createSlice({
  name: 'auth',
  initialState:
  {
    userInfo: undefined,
    isLoading: false,
  },
  reducers:
  {
    setUser(state, action)
    {
      state.userInfo = { success: true, user: action.payload }
    },
    clearUser(state)
    {
      state.userInfo = undefined
    },
  },
  extraReducers: (builder)=>
  {
    builder.addCase(authAsyncThunk.getMe.pending, (state, action) =>
    {
      state.isLoading = true
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.getMe.fulfilled, (state, action) =>
    {
      state.isLoading = false
      state.userInfo = action.payload;
    });
    builder.addCase(authAsyncThunk.getMe.rejected, (state, action) =>
    {
      state.isLoading = false
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.login.pending, (state, action) =>
    {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.login.fulfilled, (state, action) =>
    {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.login.rejected, (state, action) =>
    {
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.logout.pending, (state, action) =>
    {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.logout.fulfilled, (state, action) =>
    {
      state.userInfo = undefined;
    });
    builder.addCase(authAsyncThunk.logout.rejected, (state, action) =>
    {
      state.userInfo = undefined;
    });

    builder.addCase(authAsyncThunk.exchangeCode.pending, (state) =>
    {
      state.isLoading = true
    });
    builder.addCase(authAsyncThunk.exchangeCode.fulfilled, (state) =>
    {
      state.isLoading = false
    });
    builder.addCase(authAsyncThunk.exchangeCode.rejected, (state) =>
    {
      state.isLoading = false
    });
  }
})

export const authActions = { ...authSlice.actions }

export const authReducer = authSlice.reducer
