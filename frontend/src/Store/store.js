import { configureStore } from "@reduxjs/toolkit";
import authApiSlice from "./Slice/authApiSlice";
import authReducer from "./Slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Stores accessToken in state
    [authApiSlice.reducerPath]: authApiSlice.reducer, // Required for RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware), // Add RTK Query middleware
});

export default store;
