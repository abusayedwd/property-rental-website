import { apiSlice } from "../../api/apiSlice";

// The user's conversations with last message and unread count, newest first
const getChatlist = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChatlist: builder.query({
            query: () => `/chating/getChatlist`,
            providesTags: [{ type: "Chat", id: "LIST" }],
        }),
    }),
});

export const { useGetChatlistQuery } = getChatlist;
