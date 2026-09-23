import { apiSlice } from "@/redux/api/apiSlice";

const totalStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalStatus: builder.query({
      query: () => `/payment/totalStatus`,
    }),
  }),
});

export const { useGetTotalStatusQuery } = totalStatusApi;
