import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type MainState = {
  showMenu: boolean | undefined;
};

const initialState: MainState = {
  showMenu: undefined,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    showMenu: (state) => {
      state.showMenu = true;
    },
    hideMenu: (state) => {
      state.showMenu = false;
    },
    toggleMenu: (state) => {
      state.showMenu = !state.showMenu;
    },
  },
  extraReducers: (builder) => {},
});

export const mainActions = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
