

import { apiSlice } from "../../api/apiSlice";

const updateProperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProperty: builder.mutation({
            query: ({data, id}) => ({
                url: `/property/${id}`,
                method: "PATCH",
                body:  data
            })
        })
    })
})

export const {useUpdatePropertyMutation} = updateProperty;