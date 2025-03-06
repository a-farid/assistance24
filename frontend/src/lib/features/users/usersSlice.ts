import { IClient, IUser, IWorker } from "@/utils/interface/user_interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  users:IUser[];
  workers:IWorker[];
  clients:IClient[];
}

const initialState: UserState = {
  users: [],
  workers: [],
  clients: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getAllUsers: (state, action: PayloadAction<{ users: IUser[]}>) => {
      state.users = action.payload.users;
    },
  },
});

export const { getAllUsers } = userSlice.actions;
export default userSlice.reducer;
