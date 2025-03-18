import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include", // For cookies (if needed)
  }),
  endpoints: (builder) => ({
    getUsersForSidebar: builder.query({
      query: () => "/users",
    }),
    getMessages: builder.query({
      query: (userId) => `/${userId}`,
    }),
    sendMessage: builder.mutation({
      query: ({ userId, content }) => ({
        url: `/send/${userId}`,
        method: "POST",
        body: { content },
      }),
    }),
  }),
});

export const {
  useGetUsersForSidebarQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = messageApi;
export default messageApi;
