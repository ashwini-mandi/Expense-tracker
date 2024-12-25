// src/components/Expense.js
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses, addExpense, setTotalMoney } from "./ExpenseReducer";

const Expense = () => {
  const [expensesForm, setExpensesForm] = useState({
    money: "",
    desc: "",
    category: "",
  });

  const { expenses, totalMoney, isPremium } = useSelector(
    (state) => state.expenses
  );
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

          // Calculate the total money spent
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

      const id = (await res.json()).name; // Get Firebase's unique ID
      const newExpense = { id, ...expensesForm };
      dispatch(addExpense(newExpense)); // Update Redux state with new expense

      // Update total money spent
      const newTotalMoney = totalMoney + Number(expensesForm.money);
      dispatch(setTotalMoney(newTotalMoney));

      setExpensesForm({ money: "", desc: "", category: "" }); // Reset form
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpensesForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="card w-50 mx-auto p-4 shadow mt-5">
        <Form onSubmit={handleSubmit}>
          {/* Money Input */}
          <Form.Group controlId="formMoney" className="mb-3">
            <Form.Label>Money</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the money spent"
              value={expensesForm.money}
              name="money"
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Category Dropdown */}
          <Form.Group>
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              name="category"
              value={expensesForm.category}
              onChange={handleChange}
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

          {/* Submit Button */}
          <Button variant="primary" className="mt-4" type="submit">
            Submit
          </Button>
        </Form>
      </div>

      {/* Display Submitted Expenses */}
      <div className="mt-4 w-50 mx-auto">
        <h4>Expenses List</h4>
        {expenses.length === 0 ? (
          <p className="text-muted">No expenses added yet.</p>
        ) : (
          <ul className="list-group">
            {expenses.map((expense) => (
              <li key={expense.id} className="list-group-item">
                <strong>Money:</strong> ₹{expense.money} |{" "}
                <strong>Description:</strong> {expense.desc} |{" "}
                <strong>Category:</strong> {expense.category}
              </li>
            ))}
          </ul>
        )}

        {/* Total Money */}
        <div className="mt-3">
          <h5>
            <strong>Total Money Spent: ₹{totalMoney}</strong>
          </h5>
        </div>

        {/* Show Premium Button if Total Money Exceeds ₹10,000 */}
        {isPremium && (
          <Button variant="danger" className="mt-4">
            Activate Premium
          </Button>
        )}
      </div>
    </>
  );
};

export default Expense;
