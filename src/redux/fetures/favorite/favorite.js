import { apiSlice } from "../../api/apiSlice";

const favorite = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Full property objects for the favorites page
        getFavorites: builder.query({
            query: () => `/favorite`,
            providesTags: [{ type: "Favorite", id: "LIST" }],
        }),
        // Just the ids, used to show filled hearts on property cards
        getFavoriteIds: builder.query({
            query: () => `/favorite/ids`,
            providesTags: [{ type: "Favorite", id: "IDS" }],
        }),
        toggleFavorite: builder.mutation({
            query: (propertyId) => ({
                url: `/favorite/${propertyId}`,
                method: "POST",
            }),
            // Flip the heart immediately; roll back if the request fails
            async onQueryStarted(propertyId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    favorite.util.updateQueryData("getFavoriteIds", undefined, (draft) => {
                        const ids = draft?.data?.attributes;
                        if (!Array.isArray(ids)) return;
                        const index = ids.indexOf(propertyId);
                        if (index === -1) ids.push(propertyId);
                        else ids.splice(index, 1);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
            invalidatesTags: [{ type: "Favorite", id: "LIST" }],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useGetFavoriteIdsQuery,
    useToggleFavoriteMutation,
} = favorite;
