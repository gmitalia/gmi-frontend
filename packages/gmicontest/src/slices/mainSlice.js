import { createSlice } from '@reduxjs/toolkit'
import { authAsyncThunk } from "./authAsyncThunk";

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    showMenu: undefined
  },
  reducers: {
    showMenu: (state) => {
      state.showMenu = true
    },
    hideMenu: (state) => {
      state.showMenu = false
    },
    toggleMenu: (state) => {
      state.showMenu = !state.showMenu
    }
  },
  extraReducers: (builder) => {

  }
})

// Action creators are generated for each case reducer function
export const mainActions = mainSlice.actions
export const mainReducer = mainSlice.reducer