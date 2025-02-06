const { apiSlice } = require("@/redux/api/apiSlice");

const getPromotedASellProperties = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPromotedASellProperties: builder.query({
            query: ({ state, subState, propertyType }) => ({
                url: `/property/getPromotedASellProperties?state=${state}&subState=${subState}&propertyType=${propertyType}`,
            }),
            providesTags: [{ type: "Property" }]
        })
    })
});

export const { useGetPromotedASellPropertiesQuery } = getPromotedASellProperties;