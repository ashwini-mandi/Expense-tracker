// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer";
import expenseReducer from "./ExpenseReducer";
import themeReducer from "./themeReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer,
  },
});

export default store;
