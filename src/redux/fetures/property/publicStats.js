import { apiSlice } from "../../api/apiSlice";

// Public site numbers: active listings, landlords, members, districts covered
const publicStats = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicStats: builder.query({
            query: () => `/property/publicStats`,
            providesTags: [{ type: "Property" }],
        }),
    }),
});

export const { useGetPublicStatsQuery } = publicStats;
