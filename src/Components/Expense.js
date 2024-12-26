import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Expenses.css";
import {
  setExpenses,
  addExpense,
  setTotalMoney,
  setPremium,
} from "./ExpenseReducer";
import { toggleTheme } from "./themeReducer";
import Download from "./Download";
import DownloadCSV from "./Download";

const Expense = () => {
  const [expensesForm, setExpensesForm] = useState({
    money: "",
    desc: "",
    category: "",
  });
  const headers = ["money", "desc", "category"];

  const { expenses, totalMoney, isPremium } = useSelector(
    (state) => state.expense
  );
  const { darkMode } = useSelector((state) => state.theme); // Ensure this is correct
  const dispatch = useDispatch();

  const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

  // Fetch expenses from Firebase
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          "https://expensetracker-6be2b-default-rtdb.firebaseio.com/expenses.json"
        );
        if (!res.ok) throw new Error("Failed to fetch expenses");

        const data = await res.json();
        if (data) {
          const fetchedExpenses = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          dispatch(setExpenses(fetchedExpenses));

          const total = fetchedExpenses.reduce(
            (sum, expense) => sum + Number(expense.money || 0),
            0
          );
          dispatch(setTotalMoney(total));
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, [dispatch]);

  // Submit expense to Firebase and update local state
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://expensetracker-6be2b-default-rtdb.firebaseio.com/expenses.json",
        {
          method: "POST",
          body: JSON.stringify(expensesForm),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to save expense");

      const id = (await res.json()).name;
      const newExpense = { id, ...expensesForm };
      dispatch(addExpense(newExpense));

      const newTotalMoney = totalMoney + Number(expensesForm.money);
      dispatch(setTotalMoney(newTotalMoney));

      setExpensesForm({ money: "", desc: "", category: "" });
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  // Handle Premium Activation
  const activatePremium = () => {
    dispatch(setPremium(true));
    alert("Premium features activated!");
  };

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <div className={`card w-50 mx-auto p-4 shadow mt-5`}>
        <Form onSubmit={handleSubmit}>
          {/* Money Input */}
          <Form.Group controlId="formMoney" className="mb-3">
            <Form.Label>Money</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the money spent"
              value={expensesForm.money}
              name="money"
              onChange={(e) =>
                setExpensesForm({ ...expensesForm, money: e.target.value })
              }
              required
            />
          </Form.Group>

          {/* Description Input */}
          <Form.Group controlId="formDesc" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the description of expense"
              value={expensesForm.desc}
              name="desc"
              onChange={(e) =>
                setExpensesForm({ ...expensesForm, desc: e.target.value })
              }
              required
            />
          </Form.Group>

          {/* Category Dropdown */}
          <Form.Group>
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              name="category"
              value={expensesForm.category}
              onChange={(e) =>
                setExpensesForm({ ...expensesForm, category: e.target.value })
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" className="mt-4" type="submit">
            Submit
          </Button>
        </Form>
      </div>

      {/* Expenses List and Total Money */}
      <div className="mt-4 w-50 mx-auto">
        <h4>Expenses List</h4>
        {expenses.length === 0 ? (
          <p className="text-muted">No expenses added yet.</p>
        ) : (
          <ul className="list-group">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className={`list-group-item ${
                  darkMode ? "bg-dark text-light" : "bg-light text-dark"
                }`}
              >
                <strong>Money:</strong> ₹{expense.money} |{" "}
                <strong>Description:</strong> {expense.desc} |{" "}
                <strong>Category:</strong> {expense.category}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3">
          <h5>Total Money Spent: ₹{totalMoney}</h5>
        </div>

        {/* Premium Button */}
        {totalMoney > 10000 && !isPremium && (
          <Button variant="danger" className="mt-4" onClick={activatePremium}>
            Activate Premium
          </Button>
        )}

        {/* Dark Theme Toggle */}
        {isPremium && (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => dispatch(toggleTheme())}
          >
            Switch to {darkMode ? "Light" : "Dark"} Theme
          </Button>
        )}
      </div>
      {isPremium && (
        <DownloadCSV
          data={expenses} // Pass expenses as data
          headers={headers} // Pass headers for CSV
          filename="expenses.csv" // Define filename
          disabled={expenses.length === 0} // Disable if no expenses
        />
      )}
    </div>
  );
};

export default Expense;
