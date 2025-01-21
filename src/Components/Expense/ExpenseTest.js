import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExpenseForm from "./ExpenseForm";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { expenseActions } from "../Context/expense-slice";

// Mock the Redux store
const mockStore = createStore(() => ({
  auth: { userEmail: "test@example.com" },
  expenseStore: { editItems: null }, // Change to non-null to test edit
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("ExpenseForm", () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
  });

  test("should render the form with all fields", () => {
    render(
      <Provider store={mockStore}>
        <ExpenseForm />
      </Provider>
    );
    expect(screen.getByLabelText(/Amount/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/)).toBeInTheDocument();
  });

  test("should show error message if any input is empty on submit", async () => {
    render(
      <Provider store={mockStore}>
        <ExpenseForm />
      </Provider>
    );

    const submitButton = screen.getByRole("button", { name: /Add Expense/ });
    fireEvent.click(submitButton);

    // Check if the error message is shown
    expect(screen.getByText("*Please fill all inputs.")).toBeInTheDocument();
  });

  test("should submit the form when all fields are filled", async () => {
    render(
      <Provider store={mockStore}>
        <ExpenseForm />
      </Provider>
    );

    const amtInput = screen.getByLabelText(/Amount/);
    const desInput = screen.getByLabelText(/Description/);
    const dateInput = screen.getByLabelText(/Date/);
    const cateInput = screen.getByLabelText(/Category/);
    const submitButton = screen.getByRole("button", { name: /Add Expense/ });

    fireEvent.change(amtInput, { target: { value: "100" } });
    fireEvent.change(desInput, { target: { value: "Test expense" } });
    fireEvent.change(dateInput, { target: { value: "2025-01-01" } });
    fireEvent.change(cateInput, { target: { value: "food" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check if the form is reset and the data is sent to the API
    expect(fetch).toHaveBeenCalledWith(
      "https://expensetracker-6be2b-default-rtdb.firebaseio.com/testexamplecom/expenses.json",
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      })
    );
  });

  test("should handle expense editing properly", async () => {
    const mockStoreWithEdit = createStore(() => ({
      auth: { userEmail: "test@example.com" },
      expenseStore: {
        editItems: {
          id: "1",
          enteredAmt: "50",
          enteredDes: "Old expense",
          date: "2024-01-01",
          category: "food",
        },
      },
    }));

    render(
      <Provider store={mockStoreWithEdit}>
        <ExpenseForm />
      </Provider>
    );

    // Ensure that the form fields are populated with the edit values
    expect(screen.getByLabelText(/Amount/).value).toBe("50");
    expect(screen.getByLabelText(/Description/).value).toBe("Old expense");
    expect(screen.getByLabelText(/Date/).value).toBe("2024-01-01");
    expect(screen.getByLabelText(/Category/).value).toBe("food");

    const submitButton = screen.getByRole("button", { name: /Add Expense/ });
    fireEvent.click(submitButton);

    // Check if the delete API is called when an expense is being edited
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
