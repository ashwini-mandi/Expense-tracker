import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const Expense = () => {
  const [expenses, setExpenses] = useState({
    money: "",
    desc: "",
    category: "",
  });
  const [display, setDisplay] = useState([]);
  const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplay((prev) => [...prev, expenses]);
    setExpenses({ money: "", desc: "", category: "" });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate total money
  const totalMoney = display.reduce((total, expense) => {
    return total + Number(expense.money);
  }, 0);

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
        <ul className="list-group">
          {display.map((expense, index) => (
            <li key={index} className="list-group-item">
              <strong>Money:</strong> ₹{expense.money} |{" "}
              <strong>Description:</strong> {expense.desc} |{" "}
              <strong>Category:</strong> {expense.category}
            </li>
          ))}
        </ul>

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
