import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggedOut } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
  activationCodeTemp: number;
};

type RegistrationData = {
  name: string;
  password: string;
  email: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error) {
          console.log("ErrorRegisterAction: ", error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "user/activate",
        method: "POST",
        body: {
          activationToken: activation_token,
          activationCode: activation_code,
        },
        credentials: "include",
      }),
    }),
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "auth/login",
        method: "POST",
        body: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              access_token: result.data.access_token,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("ErrorLoginAction: ", error);
        }
      },
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "auth/registre",
        method: "POST",
        body: {
          ...data,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              access_token: result.data.access_token,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("ErrorLoginAction: ", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/signout",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log("ErrorLogOutAction: ", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
