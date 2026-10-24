import { apiSlice } from "@/redux/api/apiSlice";

// Searches a member saved to get alerts about new matching listings
const savedSearches = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedSearches: builder.query({
      query: () => "/saved-searches",
      providesTags: ["SavedSearch"],
    }),
    createSavedSearch: builder.mutation({
      query: (body) => ({ url: "/saved-searches", method: "POST", body }),
      invalidatesTags: ["SavedSearch"],
    }),
    updateSavedSearch: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/saved-searches/${id}`, method: "PATCH", body }),
      invalidatesTags: ["SavedSearch"],
    }),
    deleteSavedSearch: builder.mutation({
      query: (id) => ({ url: `/saved-searches/${id}`, method: "DELETE" }),
      invalidatesTags: ["SavedSearch"],
    }),
  }),
});

export const { useGetSavedSearchesQuery, useCreateSavedSearchMutation, useUpdateSavedSearchMutation, useDeleteSavedSearchMutation } = savedSearches;
