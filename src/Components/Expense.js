import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const Expense = () => {
  const [expenses, setExpenses] = useState({
    money: "",
    desc: "",
    category: "",
  });
  const [display, setDisplay] = useState([]);
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
          // Transform directly and update state
          setDisplay(
            Object.entries(data).map(([id, value]) => ({
              id,
              ...value,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, []);

  // Submit expense to Firebase and update local state
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://expensetracker-6be2b-default-rtdb.firebaseio.com/expenses.json",
        {
          method: "POST",
          body: JSON.stringify(expenses),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to save expense");

      const id = (await res.json()).name; // Get Firebase's unique ID
      setDisplay((prev) => [...prev, { id, ...expenses }]); // Update local state
      setExpenses({ money: "", desc: "", category: "" }); // Reset form
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate total money efficiently
  const totalMoney = display.reduce(
    (sum, expense) => sum + Number(expense.money || 0),
    0
  );

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
              value={expenses.money}
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
              value={expenses.desc}
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
              value={expenses.category}
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
        {display.length === 0 ? (
          <p className="text-muted">No expenses added yet.</p>
        ) : (
          <ul className="list-group">
            {display.map((expense) => (
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
      </div>
    </>
  );
};

export default Expense;
