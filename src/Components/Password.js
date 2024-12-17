import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

const Password = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });
    setLoading(true);
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({ email, requestType: "PASSWORD_RESET" }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error.message || "failed to send mail");
      }
      setMessage({
        type: "success",
        content:
          "Password reset email sent successfully. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error:", error.message);
      setMessage({ type: "danger", content: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container mt-5">
        <h3 className="text-center mb-4">Password Reset</h3>
        <div className="card w-50 mx-auto p-4 shadow">
          {message.content && (
            <Alert variant={message.type} className="text-center">
              {message.content}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Email"}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Password;
