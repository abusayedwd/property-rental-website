import { apiSlice } from "@/redux/api/apiSlice";

// Owner's phone numbers, only for signed-in members (fetched when they tap "Show number")
const ownerContact = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerContact: builder.query({
      query: (propertyId) => `/property/${propertyId}/contact`,
    }),
  }),
});

export const { useLazyGetOwnerContactQuery } = ownerContact;
