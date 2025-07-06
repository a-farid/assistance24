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
    updateUser: (state, action: PayloadAction<{ user: IUser }>) => {
      const index = state.users.findIndex(user => user.id === action.payload.user.id);
      if (index !== -1) {
        state.users[index] = action.payload.user;
      }
    },
    addUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state.users.push(action.payload.user);
    }
  },
});

export const { getAllUsers, updateUser, addUser } = userSlice.actions;
export default userSlice.reducer;
