import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Components/Context/auth-slice";
import expenseReducer from "../Components/Context/expense-slice";
import themeReducer from "../Components/Context/theme-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenseStore: expenseReducer,
    theme: themeReducer,
  },
});

export default store;
