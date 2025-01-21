import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verifyMail, setVerifyMail] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.cpassword) {
      alert("Password does not match Confirm Password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error.message || "Sign Up failed. Try again.");
      }

      const emailRes = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: data.idToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!emailRes.ok) {
        throw new Error("Failed to send verification email. Try again.");
      }

      alert("Verification email sent. Please check your inbox.");
      setVerifyMail(true);

      await checkVerification(data.idToken);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerification = async (token) => {
    try {
      let isVerified = false;
      while (!isVerified) {
        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
          {
            method: "POST",
            body: JSON.stringify({ idToken: token }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        isVerified = data.users[0]?.emailVerified;

        if (isVerified) {
          alert("Email verified! You can now log in.");
          setVerificationComplete(true);
          break;
        } else {
          alert("Please verify your email before proceeding.");
          setVerifyMail(true);
          break;
        }
      }
    } catch (error) {
      alert("Failed to check email verification. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center ">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h1 className="mb-4 text-center">Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password (at least 6 characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || verificationComplete}
            className="w-100"
          >
            {isLoading
              ? "Sending request..."
              : verificationComplete
              ? "Verified"
              : "Sign up"}
          </Button>
          {verifyMail && (
            <p style={{ margin: "1rem", color: "green" }}>
              Verification email sent. Please verify your email.
            </p>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Signup;
