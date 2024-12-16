import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [errorState, setErrorState] = useState({
    showAlert: false,
    apiError: null,
  });
  const navigate = useNavigate();

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorState({
          showAlert: false,
          apiError: "User is not authenticated.",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms`, // Replace with your Firebase API key
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: token,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error.message || "Failed to fetch profile data."
          );
        }

        const userInfo = data.users[0]; // Firebase returns user info in `users` array
        setFormData({
          name: userInfo.displayName || "",
          photoUrl: userInfo.photoUrl || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        setErrorState({
          showAlert: false,
          apiError: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorState({
        showAlert: false,
        apiError: "User is not authenticated.",
      });
      return;
    }

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms`, // Replace with your Firebase API key
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
            displayName: formData.name,
            photoUrl: formData.photoUrl,
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || "Failed to update profile.");
      }

      setErrorState({ showAlert: true, apiError: null });
      setTimeout(() => navigate("/welcome"), 3000); // Redirect after success
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setErrorState({ showAlert: false, apiError: error.message });
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-3">
      {/* Success Alert */}
      {errorState.showAlert && (
        <Alert variant="success" className="text-center">
          Profile updated successfully! Redirecting...
        </Alert>
      )}
      {/* Error Alert */}
      {errorState.apiError && (
        <Alert variant="danger" className="text-center">
          {errorState.apiError}
        </Alert>
      )}
      {/* Profile Form */}
      <div className="card p-4 w-50 mx-auto shadow">
        <h3 className="text-center mb-4">Complete Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPhotoUrl">
            <Form.Label>Photo URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your photo URL"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
