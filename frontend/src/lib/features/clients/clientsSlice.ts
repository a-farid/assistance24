import { IClient, IUser, IWorker } from "@/utils/interface/user_interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  users: IUser[];
  workers: IWorker[];
  clients: IClient[];
}

const initialState: UserState = {
  users: [],
  workers: [],
  clients: [],
};

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    getAllClients: (state, action: PayloadAction<{ clients: IClient[] }>) => {
      state.clients = action.payload.clients;
    },
    updateClient: (state, action: PayloadAction<{ client: IClient }>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.client.id);
      if (index !== -1) {
        state.clients[index] = action.payload.client;
      }
    },
    addClient: (state, action: PayloadAction<{ client: IClient }>) => {
      state.clients.push(action.payload.client);
    }
  },
});

export const { getAllClients, updateClient, addClient } = clientSlice.actions;
export default clientSlice.reducer;
