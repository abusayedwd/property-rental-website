


const { apiSlice } = require("@/redux/api/apiSlice");


const getAllMyproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMyproperty: builder.query({
            query: () => `/property/getAllProperties`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetAllMypropertyQuery} = getAllMyproperty