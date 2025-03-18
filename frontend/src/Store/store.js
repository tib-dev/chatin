import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Slice/authApiSlice";
import { messageApi } from "./Slice/messageSlice"; // Use named import
import authReducer from "./Slice/authSlice";
import themeReducer from "./Slice/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer, // Ensure correct API key
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, messageApi.middleware), // Add both APIs to middleware
});
