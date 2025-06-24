import { apiSlice } from "../api/apiSlice";
import { userSetInfos } from "../auth/authSlice";
import { getAllUsers } from "./usersSlice";

// Type definition for the profile update data
type UpdateProfileData = {
  adress?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

// ✅ Extend apiSlice with additional endpoints
export const usersApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: "/users/all",
        method: "GET",
        params: { page, limit },
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(getAllUsers({ users: result.data.data })); // ✅ Ensure correct data structure
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
    }),
    editConnectedUser: builder.mutation<any, UpdateProfileData>({
      query: (profileData) => ({
        url: "users/me",
        method: "PUT",
        body: profileData,
        headers: {"Content-Type": "application/json"},
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userSetInfos({ user: result.data.data }));
        } catch (error) {
          console.log("Error [editConnectedUser] updating profile: ", error);
        }
      },
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "users/create",
        method: "POST",
        body: userData,
        headers: {"Content-Type": "application/json"},
        credentials: "include",

  }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // Optionally handle the result, e.g., show a success message or update state
          console.log("User created successfully:", result.data);
        } catch (error) {
          console.log("Error creating user:", error);
        }
      },
    }),
  }),
});

// ✅ Export the generated hooks
export const { useGetUsersQuery, useEditConnectedUserMutation, useCreateUserMutation } = usersApi;