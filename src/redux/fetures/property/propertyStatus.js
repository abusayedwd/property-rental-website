

import { apiSlice } from "../../api/apiSlice";

const propertyStatus = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        propertyStatus: builder.mutation({
            query: ({id, propertyType }) => ({
                url: `/property/updatePropertyStatus/${id}`,
                method: "PUT",
                body: {propertyType : propertyType}
            }),
            invalidatesTags: [{type: "Property"}]
        })
    })
})

export const {usePropertyStatusMutation} = propertyStatus;