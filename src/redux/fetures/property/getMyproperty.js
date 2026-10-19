const { apiSlice } = require("@/redux/api/apiSlice");

// params: { page, limit, sortBy, propertyType } - empty values are left out
const toQueryString = (params = {}) =>
    new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();

const getMyproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyproperty: builder.query({
            query: (params) => `/property/getMyProperty?${toQueryString(params)}`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetMypropertyQuery} = getMyproperty
