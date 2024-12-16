import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "", // This state is still required for Sign Up mode
  });
  const [isLogin, setLogin] = useState(true);
  const [errorState, setErrorState] = useState({
    showAlert: false,
    passwordMatchError: false,
    apiError: null,
  });
  const navigate = useNavigate();

  const toggle = () => {
    setLogin(!isLogin);
  };

  const url = isLogin
    ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms" // Replace with your actual API key
    : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms"; // Replace with your actual API key

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password match while typing in "Confirm Password"
    if (name === "cpassword" && !isLogin) {
      setErrorState((prevState) => ({
        ...prevState,
        passwordMatchError: value !== formData.password,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not login mode, validate password match
    if (!isLogin && formData.password !== formData.cpassword) {
      setErrorState((prevState) => ({
        ...prevState,
        passwordMatchError: true,
      }));
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          returnSecureToken: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorState({
          showAlert: false,
          passwordMatchError: false,
          apiError:
            data.error.message || "Something went wrong. Please try again.",
        });
      } else {
        setErrorState({
          showAlert: true,
          passwordMatchError: false,
          apiError: null,
        });
        const data = await res.json();
        localStorage.setItem("token", data.idToken); // Save the token
        navigate("/welcome");
        setTimeout(
          () =>
            setErrorState((prevState) => ({ ...prevState, showAlert: false })),
          3000
        );
      }
    } catch (error) {
      console.error("Error submitting data: ", error);
      alert("Failed to submit data. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center flex-column mt-3">
      {errorState.showAlert && (
        <Alert variant="success" className="w-50 text-center">
          Data submitted successfully!
        </Alert>
      )}
      {errorState.apiError && (
        <Alert variant="danger" className="w-50 text-center">
          {errorState.apiError}
        </Alert>
      )}
      {errorState.passwordMatchError && (
        <Alert variant="danger" className="w-50 text-center">
          Password and Confirm Password do not match.
        </Alert>
      )}

      <div className="card p-4 w-50 shadow">
        <h3 className="text-center mb-4">User Form</h3>
        <Form
          className="d-flex flex-column align-items-center"
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3 w-100" controlId="formBasicCPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                name="cpassword"
                value={formData.cpassword}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </Form>
      </div>
      <div
        className="mt-5 d-flex justify-content-center"
        style={{ width: "50rem" }}
      >
        <Button variant="primary" type="button" onClick={toggle}>
          {isLogin ? "Create new account" : "Login with existing account"}
        </Button>
      </div>
    </Container>
  );
};

export default UserForm;
