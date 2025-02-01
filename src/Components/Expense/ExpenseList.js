import React, { useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../Context/expense-slice";
import "./ExpenseList.css";
import {
  Button,
  ListGroup,
  Row,
  Col,
  Container,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { themeActions } from "../Context/theme-slice";
import { FaCrown } from "react-icons/fa";
import { authActions } from "../Context/auth-slice";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const expense = useSelector((state) => state.expenseStore);

  const editClickHandler = (item) => {
    dispatch(
      expenseActions.editItem({
        item,
        filtered: expense.items.filter((ele) => ele !== item),
      })
    );
  };

  const dltClickHandler = async (item) => {
    dispatch(expenseActions.removeItem(item));
    const email = auth.userEmail.replace(/[.@]/g, "");

    try {
      const res = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`
      );
      const data = await res.json();
      const Id = Object.keys(data).find((eleId) => data[eleId].id === item.id);

      if (Id) {
        await fetch(
          `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses/${Id}.json`,
          { method: "DELETE" }
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  const restoreItems = async () => {
    const email = auth.userEmail.replace(/[.@]/g, "");
    try {
      const res = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`
      );
      const data = await res.json();
      if (data) {
        dispatch(expenseActions.setItems(Object.values(data).reverse()));
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (auth.userEmail) {
      restoreItems();
    }
  }, [auth.userEmail]);

  const total = expense.items.reduce(
    (sum, item) => sum + Number(item.enteredAmt),
    0
  );

  const clickActPremiumHandler = async () => {
    dispatch(themeActions.toggleTheme());
    const email = auth.userEmail.replace(/[.@]/g, "");

    try {
      const response = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/userDetail.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPremium: true }),
        }
      );
      if (response.ok) {
        dispatch(authActions.setIsPremium());
        localStorage.setItem("isPremium", true);
      }
    } catch (error) {
      alert("Failed to activate premium. Error: " + error.message);
    }
  };

  const clickDownloadHandler = () => {
    const csvRows = [
      ["Date", "Description", "Category", "Amount"],
      ...expense.items.map((i) => [
        i.date,
        i.enteredDes,
        i.category,
        i.enteredAmt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "expenses.csv";
    downloadLink.click();
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} md={10} sm={12}>
          <Card className="shadow-lg rounded-4 p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">
                Total Expense: <span className="text-primary">₹{total}</span>
              </h3>
              {total >= 10000 && !auth.isPremium ? (
                <Button variant="danger" onClick={clickActPremiumHandler}>
                  Activate Premium
                </Button>
              ) : total >= 10000 && auth.isPremium ? (
                <Button variant="warning" onClick={clickDownloadHandler}>
                  <FaCrown className="me-2" />
                  Download List
                </Button>
              ) : null}
            </div>
            {total >= 10000 && !auth.isPremium && (
              <p className="text-danger">
                *Please Activate Premium, total expenses exceed ₹10,000
              </p>
            )}
            <div className="expense-list-container">
              <ListGroup>
                {expense.items.map((i, index) => (
                  <ListGroup.Item key={index} className="expense-item">
                    <div
                      className="expense-details"
                      style={{ display: "flex", gap: "2rem" }}
                    >
                      <span className="expense-date">{i.date}</span>
                      <span className="expense-category">{i.category}</span>
                      <span className="expense-description">
                        {i.enteredDes}
                      </span>
                      <span className="expense-amount">₹{i.enteredAmt}</span>

                      {/* <div className="expense-actions"> */}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => editClickHandler(i)}
                          className="me-2"
                        >
                          <AiFillEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => dltClickHandler(i)}
                        >
                          <AiFillDelete />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpenseList;
