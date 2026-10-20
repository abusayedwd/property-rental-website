import { apiSlice } from "../../api/apiSlice";

const viewings = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // as: "sent" (my requests) | "received" (requests for my properties)
        getViewings: builder.query({
            query: (as = "sent") => `/viewings?as=${as}`,
            providesTags: (result, error, as) => [{ type: "Viewing", id: as }],
        }),
        requestViewing: builder.mutation({
            query: (body) => ({ url: `/viewings`, method: "POST", body }),
            invalidatesTags: [{ type: "Viewing", id: "sent" }],
        }),
        updateViewing: builder.mutation({
            query: ({ id, status, note }) => ({ url: `/viewings/${id}`, method: "PATCH", body: { status, note } }),
            invalidatesTags: [{ type: "Viewing", id: "sent" }, { type: "Viewing", id: "received" }, { type: "Property" }],
        }),
    }),
});

export const { useGetViewingsQuery, useRequestViewingMutation, useUpdateViewingMutation } = viewings;
