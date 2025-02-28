"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {userLoggedOut,AuthState, userLoggedIn} from "../auth/authSlice";
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

const modelQuery: any = (method: string, url: string, body: any=null) => {
  if (body){
    return{
      url: url,
      method: method,
      body,
      credentials: "include" as const,
    }
  } else {
    return{
      url: url,
      method: method,
      credentials: "include" as const,
    }
  }
}

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    const refreshResult = (await baseQuery({ url: "/auth/refresh", method: "GET" }, api, extraOptions)) as any;
    if (refreshResult?.data) {
      api.dispatch(userLoggedIn({ access_token: refreshResult.data.data.access_token, user: refreshResult.data.data.user }));
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
    refreshToken: builder.query({query: () => (modelQuery("GET", "/auth/refresh")),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;
        dispatch(userLoggedIn({ access_token: result?.data.data.access_token, user: result?.data.data.user }))},
    }),
    checkUsername: builder.mutation({
          query: (data) => ({
            url: "auth/check_username",
            method: "POST",
            body: data,
            credentials: "include",
          }),
        }),
    checkEmail: builder.mutation({
          query: (data) => ({
            url: "auth/check_email",
            method: "POST",
            body: data,
            credentials: "include",
          }),
        }),

  }),
});

export const { useRefreshTokenQuery, useCheckEmailMutation, useCheckUsernameMutation } = apiSlice;
