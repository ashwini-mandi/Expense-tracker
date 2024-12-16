import React from "react";
import { Container } from "react-bootstrap";

const WelcomeScreen = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center flex-column mt-5">
      <h1>Welcome to Expense Tracker</h1>
      <p>Enjoy managing your expenses efficiently!</p>
    </Container>
  );
};

export default WelcomeScreen;
