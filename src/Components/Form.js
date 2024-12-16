import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    cpassword: "",
  });
  const [showAlert, setShowAlert] = useState(false); // State for showing alert

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    setShowAlert(true); // Show the alert
    setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
  };

  return (
    <Container className="d-flex justify-content-center align-items-center flex-column mt-3">
      {showAlert && (
        <Alert variant="success" className="w-50 text-center">
          Data submitted successfully!
        </Alert>
      )}

      <Form
        className="d-flex flex-column align-items-center w-50"
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-3 w-100" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 w-100" controlId="formBasicPhone">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter your phone number"
            name="phone"
            value={formData.cpassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default UserForm;
