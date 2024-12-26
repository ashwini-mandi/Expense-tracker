// src/features/expense/expenseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  totalMoney: 0,
  isPremium: false, // Track if the user has reached the premium threshold
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    setTotalMoney(state, action) {
      state.totalMoney = action.payload;
    },
    setPremium(state, action) {
      state.isPremium = action.payload;
    },
  },
});

export const { setExpenses, addExpense, setTotalMoney, setPremium } =
  expenseSlice.actions;
export default expenseSlice.reducer;
