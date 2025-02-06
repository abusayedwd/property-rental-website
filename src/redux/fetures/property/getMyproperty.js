
const { apiSlice } = require("@/redux/api/apiSlice");


const getMyproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyproperty: builder.query({
            query: () => `/property/getMyProperty`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetMypropertyQuery} = getMyproperty