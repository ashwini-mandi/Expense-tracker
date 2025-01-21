import React, { useState } from "react";
import LoginForm from "./Login";
import SignupForm from "./SignUP";

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">Welcome To Expense Tracker</h1>
      <div
        style={{
          maxWidth: "350px",
          padding: "15px",
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {isLogin ? <LoginForm /> : <SignupForm />}
        <div className="mt-2">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={switchHandler}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={switchHandler}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupLogin;
