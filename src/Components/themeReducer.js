// src/features/theme/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    enableDarkMode: (state) => {
      state.darkMode = true;
    },
    disableDarkMode: (state) => {
      state.darkMode = false;
    },
  },
});

export const { toggleTheme, enableDarkMode, disableDarkMode } =
  themeSlice.actions;
export default themeSlice.reducer;
