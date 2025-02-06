
import { apiSlice } from "../../api/apiSlice";

const sendMessage = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage : builder.mutation({
            query: (data) => ({
                url: `/messages/sendMessage`,
                method: "POST",
                body:  data
            })
        })
    })
})

export const {useSendMessageMutation} = sendMessage;