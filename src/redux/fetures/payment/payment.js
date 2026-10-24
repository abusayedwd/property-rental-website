import { apiSlice } from "@/redux/api/apiSlice";

const payment = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // body: { propertyId, plan: "7d" | "15d" | "30d" } -> { url } of the checkout page
    payment: builder.mutation({
      query: (body) => ({
        url: `/payment/pay`,
        method: "POST",
        body,
      }),
    }),
    // Featured plans in Taka
    getPromotionPlans: builder.query({
      query: () => "/payment/plans",
      providesTags: ["Plans"],
    }),
  }),
});

export const { usePaymentMutation, useGetPromotionPlansQuery } = payment;
