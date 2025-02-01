import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../Context/expense-slice";

const ExpenseForm = () => {
  const amtInputRef = useRef();
  const desInputRef = useRef();
  const dateRef = useRef();
  const cateRef = useRef();
  const formRef = useRef();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const expense = useSelector((state) => state.expenseStore);
  const [isInputValid, setIsInputValid] = useState(true);

  useEffect(() => {
    if (expense.editItems !== null) {
      amtInputRef.current.value = expense.editItems.enteredAmt;
      desInputRef.current.value = expense.editItems.enteredDes;
      dateRef.current.value = expense.editItems.date;
      cateRef.current.value = expense.editItems.category;
    }
  }, [expense.editItems]);

  const clickAddHandler = async (e) => {
    e.preventDefault();
    if (
      amtInputRef.current.value === "" ||
      desInputRef.current.value === "" ||
      dateRef.current.value === ""
    ) {
      setIsInputValid(false);
      return;
    }
    setIsInputValid(true);
    if (expense.editItems !== null) {
      const email = auth.userEmail.replace(/[\.@]/g, "");
      try {
        const res = await fetch(
          `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`
        );
        const data = await res.json();
        const Id = Object.keys(data).find(
          (eleId) => data[eleId].id === expense.editItems.id
        );
        await fetch(
          `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses/${Id}.json`,
          { method: "DELETE" }
        );
      } catch (error) {
        alert(error);
      }
      dispatch(expenseActions.setEditItemsNull());
    }

    const expDetail = {
      id: Math.random().toString(),
      enteredAmt: amtInputRef.current.value,
      enteredDes: desInputRef.current.value,
      date: dateRef.current.value,
      category: cateRef.current.value,
    };
    formRef.current.reset();
    const email = auth.userEmail.replace(/[\.@]/g, "");
    try {
      await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`,
        { method: "POST", body: JSON.stringify(expDetail) }
      );
    } catch (error) {
      alert(error);
    }
    dispatch(expenseActions.addItem(expDetail));
    formRef.current.reset();
  };

  return (
    <div className="d-flex align-items-center justify-content-center  mt-5 ">
      <Card className="p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Add New Expense</Card.Title>
          <Form ref={formRef}>
            {!isInputValid && (
              <p className="text-danger text-center">
                *Please fill all inputs.
              </p>
            )}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" ref={amtInputRef} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" ref={desInputRef} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" ref={dateRef} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select ref={cateRef}>
                    <option value="food">Food</option>
                    <option value="petrol">Petrol</option>
                    <option value="salary">Salary</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant={expense.editItems ? "warning" : "primary"}
              type="submit"
              onClick={clickAddHandler}
              className="w-100"
            >
              {expense.editItems ? "Update Expense" : "Add Expense"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExpenseForm;
