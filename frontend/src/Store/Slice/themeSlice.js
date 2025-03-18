import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "../../Constants";

const initialState = {
  theme: localStorage.getItem("theme") || THEMES[0], // Default to the first theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload); // Persist theme in localStorage
    },
    nextTheme: (state) => {
      const currentIndex = THEMES.indexOf(state.theme);
      state.theme = THEMES[(currentIndex + 1) % THEMES.length]; // Cycle themes
      localStorage.setItem("theme", state.theme); // Persist theme in localStorage
    },
  },
});

export const { setTheme, nextTheme } = themeSlice.actions;
export default themeSlice.reducer;
