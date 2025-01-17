import { createSlice } from '@reduxjs/toolkit'
import { authAsyncThunk } from "./authAsyncThunk";

export const authSlice = createSlice({
	name: 'auth',
	initialState:
	{
		userInfo: undefined
	},
	reducers:
	{
	},
	extraReducers: (builder)=>
	{
		builder.addCase(authAsyncThunk.getMe.pending, (state, action) =>
		{
			state.userInfo = undefined;
		});
		builder.addCase(authAsyncThunk.getMe.fulfilled, (state, action) =>
		{
			state.userInfo = action.payload;
		});
		builder.addCase(authAsyncThunk.getMe.rejected, (state, action) =>
		{
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
	}
})

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions

export const authReducer = authSlice.reducer