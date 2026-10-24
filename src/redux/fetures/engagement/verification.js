import { apiSlice } from "@/redux/api/apiSlice";

// Landlord "Verified owner" badge: status and NID submission
const verification = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyVerification: builder.query({
      query: () => "/verification/me",
      providesTags: ["Verification"],
    }),
    submitVerification: builder.mutation({
      query: (formData) => ({ url: "/verification", method: "POST", body: formData }),
      invalidatesTags: ["Verification"],
    }),
  }),
});

export const { useGetMyVerificationQuery, useSubmitVerificationMutation } = verification;
