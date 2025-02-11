import { apiSlice } from "@/redux/api/apiSlice";

 

const payment = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        payment : builder.mutation({
            query: (propertyId) => ({
                url: `/payment/create-promotion-payment`,
                method: "POST",
                body:  propertyId
            })
        })
    })
})

export const {usePaymentMutation} = payment;