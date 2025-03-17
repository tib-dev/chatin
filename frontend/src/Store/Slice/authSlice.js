import { createSlice } from "@reduxjs/toolkit";
import {authApi} from "./authApiSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    user: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload;
      }
    );
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
