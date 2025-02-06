

const { apiSlice } = require("@/redux/api/apiSlice");


const getSingleproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSingleproperty: builder.query({
            query: (id) => `/property/${id}`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetSinglepropertyQuery} = getSingleproperty