const { apiSlice } = require("@/redux/api/apiSlice");

// Accepts any of: state, subState, propertyType, type, search, minPrice, maxPrice,
// minRooms, sortBy (e.g. "price:asc"), page, limit. Empty values are left out.
const toQueryString = (params = {}) =>
    new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();

const getAllproperty = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllproperty: builder.query({
            query: (params) => `/property/getAllProperties?${toQueryString(params)}`,
            providesTags: [{type: "Property"}]
        })

    })
})

export const {useGetAllpropertyQuery} = getAllproperty
