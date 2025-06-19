import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggedOut } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
  activationCodeTemp: number;
};

type RegistrationData = {
  adress: string;
  first_name: string;
  last_name: string;
  phone: string;
  username: string;
  email: string;
  hashed_password: string;
  password2: string;
  admin_key: string;
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
        } catch (error: any) {
          console.log("ErrorRegisterAction: ", error.error.data);
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
          console.log("result login", result.data);
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
          console.log("ErrorSignupAction: ", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
            console.log("result logout", result.data);
            if (result.data.success) {
            // returns true
            }
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
