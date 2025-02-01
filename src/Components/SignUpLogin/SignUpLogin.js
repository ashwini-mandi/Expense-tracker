import React, { useState } from "react";
import LoginForm from "./Login";
import Signup from "./SignUP";
import classes from "./SignUpLogin.module.css";

const SignupLogin = (props) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className={classes.container}>
      <h1>Welcome To Expenes Tracker</h1>
      <div className={classes.auth}>
        {!isLogin && <Signup />}
        {isLogin && <LoginForm />}
        <div className={classes.switchCon}>
          {isLogin && (
            <p>
              Don't have an account?
              <button onClick={switchHandler}>Sign Up</button>
            </p>
          )}
          {!isLogin && (
            <p>
              Already have an account?
              <button onClick={switchHandler}>Log In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupLogin;
