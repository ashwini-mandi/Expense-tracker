import React, { useContext, useRef } from "react";
import { Button, Form } from "react-bootstrap";

const ForgotPassForm = (props) => {
  const emailInputRef = useRef();
  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: enteredEmail,
          }),
        }
      );
      alert("Reset mail sent.");
      props.onReset();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            ref={emailInputRef}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={submitHandler}>
          Reset
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassForm;
