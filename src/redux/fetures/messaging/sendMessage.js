import { apiSlice } from "../../api/apiSlice";

// body: { chatId, text }. The new message arrives for everyone via the socket.
const sendMessage = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (data) => ({
                url: `/messages/sendMessage`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useSendMessageMutation } = sendMessage;
