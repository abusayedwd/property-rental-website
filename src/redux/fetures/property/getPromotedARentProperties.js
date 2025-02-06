

// const { apiSlice } = require("@/redux/api/apiSlice");


// const getPromotionProperty = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         getPromotionProperty: builder.query({
//             query: ({state,subState,propertyType}) => `/property/getPromotedProperties?state=${state}&subState=${subState}&propertyType=${propertyType}`,
//             providesTags: [{type: "Property"}]
//         })

//     })
// })

// export const {useGetPromotionPropertyQuery} = getPromotionProperty

const { apiSlice } = require("@/redux/api/apiSlice");

const getPromotedARentProperties = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPromotedARentProperties: builder.query({
            query: ({ state, subState, propertyType }) => ({
                url: `/property/getPromotedARentProperties?state=${state}&subState=${subState}&propertyType=${propertyType}`,
            }),
            providesTags: [{ type: "Property" }]
        })
    })
});

export const { useGetPromotedARentPropertiesQuery } = getPromotedARentProperties;