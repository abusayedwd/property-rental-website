const { apiSlice } = require("@/redux/api/apiSlice");


const getUsers = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `/users/getAllUsers`,
            providesTags: [{type: "Profile"}]
        })

    })
})

export const {useGetUsersQuery} = getUsers