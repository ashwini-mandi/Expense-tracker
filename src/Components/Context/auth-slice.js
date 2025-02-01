import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: localStorage.getItem("user"),
  userEmail: localStorage.getItem("userEmail"),
  isPremium: localStorage.getItem("isPremium"),
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.tokenId;
      state.userEmail = action.payload.email;
      localStorage.setItem("user", action.payload.tokenId);
      localStorage.setItem("userEmail", action.payload.email);
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true"); // Store as string "true"
    },

    logout(state) {
      state.token = null;
      state.userEmail = null;
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      state.isPremium = false;
      state.isLoggedIn = false; // Corrected this line to false
      localStorage.removeItem("isPremium");
      localStorage.removeItem("isDark");
      localStorage.removeItem("isLoggedIn");
    },
    updateUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
        // Update user with new data
      };
    },
    setIsPremium(state) {
      state.isPremium = true;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
