

import { apiSlice } from "../../api/apiSlice";

const updateProperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProperty: builder.mutation({
            query: ({formData, id}) => ({
                url: `/property/${id}`,
                method: "PATCH",
                body:  formData
            }),
            invalidatesTags: [{type:"Property"}]
        })
    })
})

export const {useUpdatePropertyMutation} = updateProperty;