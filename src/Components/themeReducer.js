import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDark: false,
  },
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark;
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
