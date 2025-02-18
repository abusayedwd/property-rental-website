


const { apiSlice } = require("@/redux/api/apiSlice");


const getAllproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllproperty: builder.query({
            query: ({ state, subState, propertyType }) => `/property/getAllProperties?state=${state}&subState=${subState}&propertyType=${propertyType}`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetAllpropertyQuery} = getAllproperty