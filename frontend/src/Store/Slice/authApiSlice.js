import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setAccessToken } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch (error) {
          console.error("Login Error:", error);
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch (error) {
          console.error("Refresh Token Error:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(clearAuth());
      },
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: profileData,
      }),
    }),
    checkAuth: builder.query({
      query: () => "/auth/check",
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useCheckAuthQuery,
} = authApi;
