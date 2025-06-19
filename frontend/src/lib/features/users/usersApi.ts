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
      query: () => ({
        url: "/users/all",
        method: "GET",
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
  }),
});

// ✅ Export the generated hooks
export const { useGetUsersQuery, useEditConnectedUserMutation } = usersApi;