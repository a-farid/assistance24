import log from "@/utils/logger";
import { apiSlice } from "../api/apiSlice";
import { getAllClients } from "./clientsSlice";

// ✅ Extend apiSlice with clients endpoints
export const clientsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getClients: builder.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: "/users/clients/all",
        method: "GET",
        params: { page, limit },
        credentials: "include",
      }),
      // 🏷️ Add cache tags for invalidation
      providesTags: (result, error, { page, limit }) => [
        { type: 'Client', id: 'LIST' },
        // Tag each individual client for targeted updates
        ...(result?.data?.data || []).map((client: any) => ({ type: 'Client' as const, id: client.id }))
      ],
      async onQueryStarted(
        _: unknown,
        { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: Promise<any> }
      ) {
        try {
          const result = await queryFulfilled;
          console.log("Clients fetched successfully:", result.data);
          dispatch(getAllClients({ clients: result.data.data }));
        } catch (error) {
          console.error("Error fetching clients:", error);
          // log.error("getClients", "error", error);
        }
      },
    }),

    getClientById: builder.query({
      query: (clientId: string) => ({
        url: `/users/${clientId}`,
        method: "GET",
        credentials: "include",
      }),
      // 🏷️ Provide cache tag for this specific client
      providesTags: (result, error, clientId) => [{ type: 'Client', id: clientId }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error("Error fetching client:", error);
          log.error("getClientById", "error", error);
        }
      },
    }),

    toggleClientStatus: builder.mutation({
      query: (client_id: string) => ({
        url: `/users/${client_id}/toggle_status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // 🏷️ Invalidate cache for this client and the clients list
      invalidatesTags: (result, error, client_id) => [
        { type: 'Client', id: client_id },
        { type: 'Client', id: 'LIST' }
      ],
      async onQueryStarted(client_id, { dispatch, queryFulfilled, getState }) {
        console.log('Starting optimistic update for client_id:', client_id);

        // 🚀 OPTIMISTIC UPDATE - Update cache immediately
        const state = getState() as any;
        const patches: any[] = [];

        // Get all cached queries from RTK Query cache
        const cachedQueries = state.api.queries;

        // Update getClients cache
        if (cachedQueries[`getClients(undefined)`]?.data) {
          const clientListPatch = dispatch(
            clientsApi.util.updateQueryData('getClients', undefined, (draft) => {
              console.log('Updating getClients cache optimistically');
              const clientIndex = draft.data.findIndex((client: any) => client.id === client_id);
              if (clientIndex !== -1) {
                draft.data[clientIndex].disabled = !draft.data[clientIndex].disabled;
              }
            })
          );
          patches.push(clientListPatch);
        }

        // Update getClientById cache if exists
        if (cachedQueries[`getClientById("${client_id}")`]?.data) {
          const clientDetailPatch = dispatch(
            clientsApi.util.updateQueryData('getClientById', client_id, (draft) => {
              console.log('Updating getClientById cache optimistically');
              draft.data.disabled = !draft.data.disabled;
            })
          );
          patches.push(clientDetailPatch);
        }

        try {
          const result = await queryFulfilled;

          // 🔄 Update getClients cache with real server response
          dispatch(
            clientsApi.util.updateQueryData('getClients', undefined, (draft) => {
              const clientIndex = draft.data.findIndex((client: any) => client.id === client_id);
              if (clientIndex !== -1) {
                draft.data[clientIndex] = result.data.data;
              }
            })
          );

          // 🔄 Update getClientById cache with real server response
          dispatch(
            clientsApi.util.updateQueryData('getClientById', client_id, (draft) => {
              draft.data = result.data.data;
            })
          );

        } catch (error) {
          console.log("Error [toggleClientStatus] updating client status: ", error);
          // 🔄 REVERT all optimistic updates on error
          patches.forEach(patch => patch.undo());
        }
      },
    }),

    updateClient: builder.mutation({
      query: ({ client_id, profileData }) => ({
        url: `/users/${client_id}`,
        method: "PUT",
        body: profileData,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // 🏷️ Invalidate cache for this client and the clients list
      invalidatesTags: (result, error, { client_id }) => [
        { type: 'Client', id: client_id },
        { type: 'Client', id: 'LIST' }
      ],
      async onQueryStarted({ client_id, profileData }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          // Update getClients cache
          dispatch(
            clientsApi.util.updateQueryData('getClients', undefined, (draft) => {
              const clientIndex = draft.data.findIndex((client: any) => client.id === client_id);
              if (clientIndex !== -1) {
                draft.data[clientIndex] = result.data.data;
              }
            })
          );

          // Update getClientById cache
          dispatch(
            clientsApi.util.updateQueryData('getClientById', client_id, (draft) => {
              draft.data = result.data.data;
            })
          );

        } catch (error) {
          console.log("Error updating client:", error);
        }
      },
    }),

    deleteClient: builder.mutation({
      query: (client_id: string) => ({
        url: `/users/${client_id}`,
        method: "DELETE",
        credentials: "include",
      }),
      // 🏷️ Invalidate clients list
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
      async onQueryStarted(client_id, { dispatch, queryFulfilled }) {
        // 🚀 OPTIMISTIC UPDATE - Remove client from cache immediately
        const patchResult = dispatch(
          clientsApi.util.updateQueryData('getClients', undefined, (draft) => {
            draft.data = draft.data.filter((client: any) => client.id !== client_id);
          })
        );

        try {
          await queryFulfilled;
          console.log("Client deleted successfully");
        } catch (error) {
          console.log("Error deleting client:", error);
          // REVERT optimistic update on error
          patchResult.undo();
        }
      },
    }),
  }),
});

// ✅ Export the generated hooks
export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useToggleClientStatusMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
