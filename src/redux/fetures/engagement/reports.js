import { apiSlice } from "../../api/apiSlice";

const reports = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // body: { propertyId, reason, details }
        reportListing: builder.mutation({
            query: (body) => ({ url: `/reports`, method: "POST", body }),
        }),
    }),
});

export const { useReportListingMutation } = reports;
