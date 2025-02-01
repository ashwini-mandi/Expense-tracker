import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ForgotPassForm from "./ForgotPass";
import { authActions } from "../Context/auth-slice";
import { themeActions } from "../Context/theme-slice";

const LoginForm = (props) => {
  const emailInputRef = useRef();
  const passInputRef = useRef();
  const navigate = useNavigate();
  const [forgotVisible, setForgotVisible] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const logoutTimerRef = useRef();

  useEffect(() => {
    if (auth.token) {
      startLogoutTimer();

      // Add event listeners to reset logout timer on user activity
      const resetTimer = () => {
        startLogoutTimer();
      };

      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);

      window.addEventListener("click", resetTimer);

      // Cleanup event listeners when component unmounts
      return () => {
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
      };
    }
  }, [auth.token]);

  const startLogoutTimer = () => {
    clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 300 * 1000);
  };

  const handleLogout = () => {
    clearTimeout(logoutTimerRef.current);
    dispatch(authActions.logout());
    navigate("/");
  };

  const submitLoginHandle = async (event) => {
    event.preventDefault();
    setLoading(true);
    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passInputRef.current.value;

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPass,
            returnSecureToken: true,
          }),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        try {
          const response = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
            {
              method: "POST",
              body: JSON.stringify({
                idToken: data.idToken,
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          const userData = await response.json();
          console.log(userData.users);
          if (!userData.users[0].emailVerified) {
            setIsVerifyEmail(true);
            return;
          } else {
            setIsVerifyEmail(false);
            navigate("/expense-tracker", { replace: true });
            startLogoutTimer();
            dispatch(
              authActions.login({ tokenId: data.idToken, email: data.email })
            );
            const email = enteredEmail.replace(/[.@]/g, "");
            const modeRes = await fetch(
              `https://expensetracker-6be2b-default-rtdb.firebaseio.com//${email}/userDetail.json`
            );
            if (modeRes.data) {
              dispatch(themeActions.toggleTheme());
              dispatch(authActions.setIsPremium());
              localStorage.setItem("isPremium", true);
            }
          }
        } catch (error) {
          alert(error);
        }
      } else {
        throw Error("Authentication Failed");
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  const linkClickHandler = () => {
    setForgotVisible(true);
  };

  return (
    <>
      {forgotVisible ? (
        <ForgotPassForm onReset={() => setForgotVisible(false)} />
      ) : (
        <div>
          <h1>Log In</h1>
          {isVerifyEmail && (
            <p style={{ color: "red" }}>Please verify email before login.</p>
          )}
          <div className="d-flex justify-content-center align-items-center ">
            <div
              className="card p-4 shadow w-100"
              style={{ maxWidth: "400px" }}
            >
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    ref={emailInputRef}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={passInputRef}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Link onClick={linkClickHandler}>Forgot Password?</Link>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={submitLoginHandle}
                >
                  {!loading ? "Log in" : "Loading"}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
