import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    showMenu: undefined,
    theme: 'light'
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
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    }
  },
  extraReducers: (builder) => {

  }
})

// Action creators are generated for each case reducer function
export const mainActions = mainSlice.actions
export const mainReducer = mainSlice.reducer