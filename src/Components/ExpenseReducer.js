// src/slices/expenseSlice.js
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
      // Activate premium when totalMoney exceeds ₹10,000
      if (state.totalMoney > 10000) {
        state.isPremium = true;
      } else {
        state.isPremium = false;
      }
    },
  },
});

export const { setExpenses, addExpense, setTotalMoney } = expenseSlice.actions;
export default expenseSlice.reducer;
