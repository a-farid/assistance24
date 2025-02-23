import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEvent } from "../../../utils/interface/I_agenda";

export interface SecretariatState {
  events: IEvent[];
}

const initialState: SecretariatState = {
  events: [],
};

const secretariatSlice = createSlice({
  name: "secretariat",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<any>) => {
      state.events = action.payload.data;
    },
    setEvent: (state, action: PayloadAction<IEvent>) => {
      console.log("action.payload", action.payload);
      state.events.push(action.payload);
    },
    editEventAction: (state, action: PayloadAction<IEvent>) => {
      const index = state.events.findIndex(
        (element) => element.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEventAction: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
  },
});

export const { setEvents, setEvent, editEventAction, deleteEventAction } =
  secretariatSlice.actions;

export default secretariatSlice.reducer;
