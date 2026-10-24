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
    // After Stripe Checkout: confirm the payment and turn on Featured
    confirmStripePayment: builder.mutation({
      query: (sessionId) => ({ url: `/payment/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`, method: "GET" }),
      invalidatesTags: ["Property"],
    }),
    // Featured plans in Taka
    getPromotionPlans: builder.query({
      query: () => "/payment/plans",
      providesTags: ["Plans"],
    }),
  }),
});

export const { usePaymentMutation, useGetPromotionPlansQuery, useConfirmStripePaymentMutation } = payment;
