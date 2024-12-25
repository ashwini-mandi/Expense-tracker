import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
    totalAmount: 0,
    premiumActive: false,
  },
  reducers: {
    addExpense(state, action) {
      state.items.push(action.payload);
      state.totalAmount += action.payload.money;
      if (state.totalAmount > 100000) {
        state.premiumActive = true;
      }
    },

    setExpenses(state, action) {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce(
        (sum, item) => sum + item.money,
        0
      );
      state.premiumActive = state.totalAmount > 10000;
    },
    clearExpenses(state) {
      state.items = [];
      state.totalAmount = 0;
      state.premiumActive = false;
    },
  },
});

export default expenseSlice;

export const { addExpense, setExpenses, clearExpenses } = expenseSlice.actions;
