import { apiSlice } from "@/redux/api/apiSlice";

const deleteProperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/property/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Property" }, { type: "Favorite", id: "LIST" }, { type: "Favorite", id: "IDS" }],
        }),
    }),
});

export const { useDeletePropertyMutation } = deleteProperty;
