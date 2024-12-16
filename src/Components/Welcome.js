import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const WelcomeScreen = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not logged in.");
          return;
        }

        // Fetch user details to check email verification status
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          const user = data.users[0];
          setIsVerified(user.emailVerified);
          // Check if the user profile is complete (name and photoURL exist)
          setProfileComplete(!!user.displayName && !!user.photoUrl);
        } else {
          throw new Error(data.error.message);
        }
      } catch (err) {
        console.error("Error fetching user details: ", err.message);
        setError("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const sendVerificationEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in.");
        return;
      }

      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error.message);
      }

      setMessage("Verification email sent! Please check your inbox.");
      setError(null);
    } catch (err) {
      console.error("Error sending verification email: ", err.message);
      setMessage(null);
      setError(err.message);
    }
  };

  const navigateToCompleteProfile = () => {
    navigate("/complete-profile");
  };

  const history = useNavigate();
  const onLogout = () => {
    history("/");
    localStorage.removeItem("token");
  };

  return (
    <>
      <div className="container mt-3">
        <div style={{ display: "flex", gap: "4rem", justifyContent: "center" }}>
          <h3>Welcome to Expense Tracker</h3>
          <button className="mr-6" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert variant="success" className="mt-3">
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {/* Email Verification Section */}
        {!isVerified && (
          <div className="mt-3">
            <span>Your email is not verified. </span>
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={sendVerificationEmail}
            >
              Verify Now
            </Button>
          </div>
        )}

        {isVerified && (
          <Alert variant="success" className="mt-3">
            Your email is verified. Thank you!
          </Alert>
        )}

        {/* Complete Profile Section */}
        {!profileComplete && (
          <div className="mt-3">
            <span>Your profile is incomplete. </span>
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={navigateToCompleteProfile}
            >
              Complete Now
            </Button>
          </div>
        )}

        {profileComplete && (
          <Alert variant="success" className="mt-3">
            Your profile is complete. Enjoy the platform!
          </Alert>
        )}
      </div>
    </>
  );
};

export default WelcomeScreen;
