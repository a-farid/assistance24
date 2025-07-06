import log from "@/utils/logger";
import { apiSlice } from "../api/apiSlice";
import { userSetInfos } from "../auth/authSlice";
import { getAllUsers, updateUser, addUser } from "./usersSlice";
import { AppDispatch } from "@/lib/store";

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
      // 🏷️ Add cache tags for invalidation
      providesTags: (result, error, { page, limit }) => [
        { type: 'User', id: 'LIST' },
        // Tag each individual user for targeted updates
        ...(result?.data?.data || []).map((user: any) => ({ type: 'User' as const, id: user.id }))
      ],
      async onQueryStarted(
        _: unknown,
        { dispatch, queryFulfilled }: { dispatch: AppDispatch; queryFulfilled: Promise<any> }
      ) {
        try {
          const result = await queryFulfilled;
          dispatch(getAllUsers({ users: result.data.data })); // ✅ Ensure correct data structure
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
    }),

    getUserById: builder.query({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      // 🏷️ Provide cache tag for this specific user
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error("Error fetching users:", error);
          log.error("getUserById", "error", error);
        }
      },
    }),

    editConnectedUser: builder.mutation({
      query: (profileData) => ({
        url: "users/me",
        method: "PUT",
        body: profileData,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // 🏷️ Invalidate current user cache
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userSetInfos({ user: result.data.data }));
        } catch (error) {
          console.log("Error [editConnectedUser] updating profile: ", error);
        }
      },
    }),

    toggleUserStatus: builder.mutation({
      query: (user_id: string) => ({
        url: `/users/${user_id}/toggle_status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // 🏷️ Invalidate cache for this user and the users list
      invalidatesTags: (result, error, user_id) => [
        { type: 'User', id: user_id },
        { type: 'User', id: 'LIST' }
      ],
      async onQueryStarted(user_id, { dispatch, queryFulfilled, getState }) {
        console.log('Starting optimistic update for user_id:', user_id);
        
        // 🚀 OPTIMISTIC UPDATE - Update ALL cached pages that contain this user
        const state = getState() as any;
        const patches: any[] = [];
        
        // Get all cached queries from RTK Query cache
        const cachedQueries = state.api.queries;
        
        // 1️⃣ Update getUserById cache (for user detail page)
        if (cachedQueries[`getUserById("${user_id}")`]?.data) {
          const userDetailPatch = dispatch(
            usersApi.util.updateQueryData('getUserById', user_id, (draft) => {
              console.log('Updating getUserById cache optimistically');
              draft.data.disabled = !draft.data.disabled; // Toggle disabled status
            })
          );
          patches.push(userDetailPatch);
        }
        
        // 2️⃣ Update getUsers cache (for users list pages)
        Object.keys(cachedQueries).forEach(cacheKey => {
          if (cacheKey.startsWith('getUsers(') && cachedQueries[cacheKey]?.data) {
            // Extract the original query args from cache key
            const match = cacheKey.match(/getUsers\((.+)\)/);
            if (match) {
              try {
                const queryArgs = JSON.parse(match[1].replace(/'/g, '"'));
                
                // Apply optimistic update to this cached page
                const patchResult = dispatch(
                  usersApi.util.updateQueryData('getUsers', queryArgs, (draft) => {
                    const userIndex = draft.data.data.findIndex((user: any) => user.id === user_id);
                    if (userIndex !== -1) {
                      console.log(`Found user on page ${queryArgs.page}, updating optimistically`);
                      const currentUser = draft.data.data[userIndex];
                      draft.data.data[userIndex] = {
                        ...currentUser,
                        disabled: !currentUser.disabled, // Toggle disabled status
                        // status: currentUser.status === 'active' ? 'inactive' : 'active',
                      };
                    }
                  })
                );
                patches.push(patchResult);
              } catch (error) {
                console.warn('Failed to parse cache key:', cacheKey, error);
              }
            }
          }
        });

        try {
          const result = await queryFulfilled;
          // Update Redux store
          dispatch(updateUser({ user: result.data.data }));
          
          // 🔄 Update getUserById cache with real server response
          dispatch(
            usersApi.util.updateQueryData('getUserById', user_id, (draft) => {
              console.log('Updating getUserById cache with server response');
              draft.data = result.data.data;
            })
          );
          
          // 🔄 Update ALL getUsers cached pages with real server response
          Object.keys(cachedQueries).forEach(cacheKey => {
            if (cacheKey.startsWith('getUsers(') && cachedQueries[cacheKey]?.data) {
              const match = cacheKey.match(/getUsers\((.+)\)/);
              if (match) {
                try {
                  const queryArgs = JSON.parse(match[1].replace(/'/g, '"'));
                  
                  dispatch(
                    usersApi.util.updateQueryData('getUsers', queryArgs, (draft) => {
                      const userIndex = draft.data.data.findIndex((user: any) => user.id === user_id);
                      if (userIndex !== -1) {
                        console.log(`Updating user on page ${queryArgs.page} with server response`);
                        draft.data.data[userIndex] = result.data.data;
                      }
                    })
                  );
                } catch (error) {
                  console.warn('Failed to parse cache key for server update:', cacheKey, error);
                }
              }
            }
          });

        } catch (error) {
          console.log("Error [toggleUserStatus] updating user status: ", error);
          // 🔄 REVERT all optimistic updates on error
          patches.forEach(patch => patch.undo());
        }
      },
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "users/create",
        method: "POST",
        body: userData,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // 🏷️ Invalidate users list to refetch and show new user
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("User created successfully:", result.data);
          
          // 🚀 OPTIMISTIC UPDATE - Add user to cache immediately
          dispatch(
            usersApi.util.updateQueryData('getUsers', { page: 1, limit: 5 }, (draft) => {
              // Add the new user to the beginning of the list
              draft.data.data.unshift(result.data.data);
              // Update total count if available
              if (draft.data.total !== undefined) {
                draft.data.total += 1;
              }
            })
          );

          // Update Redux store
          dispatch(addUser({ user: result.data.data }));
          
        } catch (error) {
          console.log("Error creating user:", error);
        }
      },
    }),
  }),
});

// ✅ Export the generated hooks
export const {
  useGetUsersQuery,
  useEditConnectedUserMutation,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useToggleUserStatusMutation
} = usersApi;