import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Slice/authApiSlice";
import authReducer from "./Slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
