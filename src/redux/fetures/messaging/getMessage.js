import { apiSlice } from "../../api/apiSlice";

const getMessage = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessage: builder.query({
            query: (chatId) => `/messages/${chatId}`,
            providesTags: (result, error, chatId) => [{ type: "Messages", id: chatId }],
            // Opening a chat marks it read on the server, so refresh the list's unread counts
            async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(apiSlice.util.invalidateTags([{ type: "Chat", id: "LIST" }]));
                } catch {
                    /* handled by the page */
                }
            },
        }),
    }),
});

export const { useGetMessageQuery } = getMessage;
