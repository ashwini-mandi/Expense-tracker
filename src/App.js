import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import NavigationBar from "./Components/Navbar/NavBar";
import SignupLogin from "./Components/SignUpLogin/SignUpLogin";
import Profile from "./Components/Profile/Profile";
import Expense from "./Components/Expense/Expense";

function App() {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isDarkMode = useSelector((state) => state.theme.isDark);

  return (
    <Router>
      {isAuthenticated && <NavigationBar />}
      <div
        className={`App ${
          isLoggedIn && isDarkMode ? "darkTheme" : "lightTheme"
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <SignupLogin />
              ) : (
                <Navigate to="/expense-tracker" />
              )
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/expense-tracker"
            element={isAuthenticated ? <Expense /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
