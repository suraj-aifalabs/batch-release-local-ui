import { baseURL } from "@/services/apiCalls";
import { getIdTokenFromCookie } from "@/utils/cookieUtils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseAPIURL: string = baseURL ?? "";

export const trackingApi = createApi({
  reducerPath: "trackingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPIURL,
    prepareHeaders: (headers) => {
      const token = getIdTokenFromCookie()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrackingData: builder.query({
      query: ({ search, sortBy, sortOrder, page, limit, status }) => ({
        url: "tracking",
        params: {
          search,
          sortBy,
          sortOrder,
          page,
          limit,
          status,
        },
      }),
    }),
  }),
});

export const { useGetTrackingDataQuery } = trackingApi;
