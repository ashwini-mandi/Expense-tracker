import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../Context/expense-slice";
import { Button, ListGroup, Row, Col } from "react-bootstrap";
import { themeActions } from "../Context/theme-slice";
import { FaCrown } from "react-icons/fa";
import { authActions } from "../Context/auth-slice";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth); // Fetching auth state from Redux
  const expense = useSelector((state) => state.expenseStore); // Fetching expense state from Redux
  const token = auth.token; // Token from Redux store for API requests

  // Edit expense item
  const editClickHandler = (item) => {
    const filter = expense.items.filter((ele) => ele !== item);
    dispatch(expenseActions.editItem({ item: item, filtered: filter }));
  };

  // Delete expense item
  const dltClickHandler = async (item) => {
    dispatch(expenseActions.removeItem(item));
    const email = auth.userEmail.replace(/[\.@]/g, "");
    try {
      const res = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`
      );

      const data = await res.json(); // Fixing the previous error where 'res.data' was being used incorrectly
      const Id = Object.keys(data).find((eleId) => data[eleId].id === item.id);
      try {
        await fetch(
          `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses/${Id}.json`,
          { method: "DELETE" }
        );
      } catch (error) {
        alert(error);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Restore items from Firebase
  const restoreItems = async () => {
    const email = auth.userEmail.replace(/[\.@]/g, "");
    try {
      const res = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/expenses.json`
      );

      const data = await res.json();
      if (data) {
        const realData = Object.values(data).reverse();
        dispatch(expenseActions.setItems(realData)); // Restoring the items to Redux state
      }
    } catch (error) {
      alert(error);
    }
  };

  // Using useEffect to restore items when the user email is available
  useEffect(() => {
    if (auth.userEmail !== null) {
      restoreItems();
    }
  }, [auth.userEmail]);

  // Calculating total expense
  let total = 0;
  expense.items.forEach((element) => {
    total += Number(element.enteredAmt);
  });

  // Handle activating premium account
  const clickActPremiumHandler = async () => {
    dispatch(themeActions.toggelTheme());
    const email = auth.userEmail.replace(/[\/.@]/g, "");
    try {
      const response = await fetch(
        `https://expensetracker-6be2b-default-rtdb.firebaseio.com/${email}/userDetail.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adding the token to Authorization header
          },
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

  // Download expenses as CSV
  const clickDownloadHandler = () => {
    const generateCSV = (itemsArr) => {
      const csvRows = [];
      const headers = ["Date", "Description", "Category", "Amount"];
      csvRows.push(headers.join(","));

      itemsArr.forEach((i) => {
        const row = [i.date, i.enteredDes, i.category, i.enteredAmt];
        csvRows.push(row.join(","));
      });

      return csvRows.join("\n");
    };

    const csvContent = generateCSV(expense.items);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "expenses.csv";
    downloadLink.click();
  };

  return (
    <section className="d-flex flex-column justify-content-center align-items-center g-4">
      <div
        className="d-flex justify-content-center w-100 mb-3"
        style={{ maxWidth: "800px" }}
      >
        <div className="d-flex flex-row justify-content-between w-100">
          <Row className="mb-3 w-100">
            <Col>
              <h3>
                Total expense: <span>₹{total}</span>
              </h3>
            </Col>
            <Col className="text-end">
              {total >= 10000 && !auth.isPremium ? (
                <Button variant="danger" onClick={clickActPremiumHandler}>
                  Activate Premium
                </Button>
              ) : total >= 10000 && auth.isPremium ? (
                <Button variant="warning" onClick={clickDownloadHandler}>
                  <FaCrown />
                  Download List
                </Button>
              ) : null}
            </Col>
          </Row>
        </div>
        {total >= 10000 && !auth.isPremium && (
          <p className="text-danger">
            *Please Activate Premium, total expenses more than ₹10,000
          </p>
        )}
      </div>

      <div
        className="w-100"
        style={{ maxWidth: "800px", overflowY: "auto", maxHeight: "400px" }}
      >
        <ListGroup>
          {expense.items.map((i, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <div className="d-flex flex-row w-100">
                <div className="me-1" style={{ width: "10%" }}>
                  <strong>{i.date}</strong>
                </div>
                <div className="me-1" style={{ width: "20%" }}>
                  <div>{i.category}</div>
                </div>
                <div className="me-1" style={{ width: "30%" }}>
                  <div>{i.enteredDes}</div>
                </div>
                <div className="me-1" style={{ width: "20%" }}>
                  <div>₹{i.enteredAmt}</div>
                </div>
                <div
                  className="d-flex justify-content-between"
                  style={{ width: "20%" }}
                >
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => editClickHandler(i)}
                  >
                    <AiFillEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => dltClickHandler(i)}
                  >
                    <AiFillDelete />
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </section>
  );
};

export default ExpenseList;
