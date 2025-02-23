import { apiSlice } from "../api/apiSlice";
import {
  setEvent,
  setEvents,
  editEventAction,
  deleteEventAction,
} from "./secSlice";

export const secApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => ({
        url: "secretariat/agenda",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setEvents(result.data));
        } catch (error) {
          console.log("ErrorGetEventsAction: ", error);
        }
      },
    }),
    addEvent: builder.mutation({
      query: (event) => ({
        url: "secretariat/agenda",
        method: "POST",
        credentials: "include",
        body: event,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("arg", arg);
          await queryFulfilled;
          dispatch(setEvent(arg));
        } catch (error) {
          console.log("ErrorAddEventAction: ", error);
        }
      },
    }),
    editEvent: builder.mutation({
      query: (event) => ({
        url: "secretariat/agenda",
        method: "PUT",
        credentials: "include",
        body: event,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(editEventAction(result.data));
        } catch (error) {
          console.log("ErrorEditEventAction: ", error);
        }
      },
    }),
    deleteEvent: builder.mutation({
      query: (id: number) => ({
        url: `secretariat/agenda/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(deleteEventAction(arg));
        } catch (error) {
          console.log("ErrorDeleteEventAction: ", error);
        }
      },
    }),
    addMilitaire: builder.mutation({
      query: (formData) => ({
        url: "secretariat/militaire",
        method: "POST",
        credentials: "include",
        body: formData,
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     console.log("arg", arg);
      //     await queryFulfilled;
      //     dispatch(setEvent(arg));
      //   } catch (error) {
      //     console.log("ErrorAddEventAction: ", error);
      //   }
      // },
    }),
  }),
});

export const {
  useGetEventsQuery,
  useAddEventMutation,
  useEditEventMutation,
  useDeleteEventMutation,
  useAddMilitaireMutation,
}: typeof secApi = secApi;
