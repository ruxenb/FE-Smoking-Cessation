import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
    },
    logout: () => initialState, // Reset state to initial state on logout
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
