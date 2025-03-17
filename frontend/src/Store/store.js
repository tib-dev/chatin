import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Slice/authApiSlice";
import authReducer from "./Slice/authSlice";
import themeReducer from "./Slice/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
