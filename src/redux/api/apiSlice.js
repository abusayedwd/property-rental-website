import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.guidegadget.com/api/v1" ,
    baseUrl: "https://sayed3040.sobhoy.com/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      // console.log("9 baseApi", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },

    
  }),
  tagTypes: ["Profile", "Property", "Employee", "Coupon", "About"],  

  endpoints: () => ({}),
});