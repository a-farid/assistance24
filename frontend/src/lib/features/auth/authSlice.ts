import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: any;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<{ user: any; access_token: string }>
    ) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userSetInfos: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
    }
  },
});

export const { userLoggedIn, userLoggedOut, userRegistration, userSetInfos } = authSlice.actions;
export default authSlice.reducer;
