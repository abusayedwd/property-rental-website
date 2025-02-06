
import { apiSlice } from "../../api/apiSlice";

const addProperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addProperty : builder.mutation({
            query: (data) => ({
                url: `/property/createProperty`,
                method: "POST",
                body:  data
            }),
            invalidatesTags: [{type: "Property"}]
        })
    })
})

export const {useAddPropertyMutation} = addProperty;