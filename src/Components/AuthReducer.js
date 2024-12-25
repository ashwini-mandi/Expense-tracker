// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    email: "",
    password: "",
    cpassword: "",
  },
  isLogin: true,
  errorState: {
    showAlert: false,
    passwordMatchError: false,
    apiError: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setErrorState: (state, action) => {
      state.errorState = action.payload;
    },
    toggleLogin: (state) => {
      state.isLogin = !state.isLogin;
    },
  },
});

export const { setFormData, setErrorState, toggleLogin } = authSlice.actions;

export default authSlice.reducer;
