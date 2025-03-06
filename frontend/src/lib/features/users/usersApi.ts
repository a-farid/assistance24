import { apiSlice } from "../api/apiSlice";
import { getAllUsers } from "./usersSlice";

// ✅ Extend apiSlice with additional endpoints
export const usersApi = apiSlice.injectEndpoints({
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
  }),
});

// ✅ Export the generated hooks
export const { useGetUsersQuery } = usersApi;
