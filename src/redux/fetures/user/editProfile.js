import { apiSlice } from "../../api/apiSlice";

 
 const editProfile = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        editProfile: builder.mutation({
            query: ({formData, id}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: [ {type: "Profile"}]
        })
    })
 })

 export const {useEditProfileMutation} = editProfile;