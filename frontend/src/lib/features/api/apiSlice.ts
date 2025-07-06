"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedOut, AuthState, userLoggedIn } from "../auth/authSlice";
import { RootState } from "../../store";

// ✅ Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
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

// ✅ Helper function for API requests
const modelQuery = (method: string, url: string, body?: any) => ({
  url,
  method,
  ...(body && { body }),
  credentials: "include" as const,
});

// ✅ Base Query with Re-authentication
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "GET" }, api, extraOptions);

    if ((refreshResult as any)?.data) {
      api.dispatch(
        userLoggedIn({
          access_token: (refreshResult as any).data.data.access_token,
          user: (refreshResult as any).data.data.user,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(userLoggedOut());
    }
  }
  return result;
};

// ✅ Create the main API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Auth"],
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => modelQuery("GET", "/auth/refresh"),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;
        dispatch(
          userLoggedIn({
            access_token: result?.data.data.access_token,
            user: result?.data.data.user,
          })
        );
      },
    }),
    checkUsername: builder.mutation({
      query: (data) => modelQuery("POST", "auth/check_username", data),
    }),
    checkEmail: builder.mutation({
      query: (data) => modelQuery("POST", "auth/check_email", data),
    }),
  }),
});

// ✅ Export hooks
export const { useRefreshTokenQuery, useCheckEmailMutation, useCheckUsernameMutation } = apiSlice;
