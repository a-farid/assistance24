"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {userRegistration,userSetInfos,userLoggedOut,AuthState} from "../auth/authSlice";
import { RootState } from "../../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include", // ✅ Ensures cookies are included
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { token } = state.auth as AuthState;
    if (token) {
      headers.set("access_Token", token);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
    }
    return headers;
  },
});

const modelQuery: any = (method: string, url: string) => {
  return{
    url: url,
    method: method,
    credentials: "include" as const,
  }}


const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    console.log("401 error, sending refreshToken request");
    console.log("args", args);
    console.log("api", api);
    console.log("extraOptions", extraOptions);
    const refreshResult = (await baseQuery({ url: "auth/refresh", method: "GET" },api, extraOptions)) as any;

    if (refreshResult?.data) {
      api.dispatch(userRegistration({ token: refreshResult.data.access_token }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(userLoggedOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => (modelQuery("GET", "auth/refresh")),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;
        userRegistration({ token: result.data.access_token });
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "auth/me",
        method: "GET",
        credentials: "include" as const,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const {data} = await queryFulfilled;
        console.log("result", data);
        if (data.success){
          dispatch(userSetInfos({ user: data.data }));
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
