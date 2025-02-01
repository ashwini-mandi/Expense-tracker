import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ExpenseForm from "./ExpenseForm"; // Adjust import according to your file structure
import rootReducer from "../reducers"; // Adjust import according to your file structure

const mockStore = createStore(rootReducer, {
  auth: { userEmail: "test@example.com" },
  expenseStore: { items: [], editItems: null },
});

test("should render ExpenseForm component", () => {
  render(
    <Provider store={mockStore}>
      <ExpenseForm />
    </Provider>
  );

  // Check if form elements are rendered correctly
  expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
});
