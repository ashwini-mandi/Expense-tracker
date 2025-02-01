import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../Context/auth-slice";
import { expenseActions } from "../Context/expense-slice";
import { themeActions } from "../Context/theme-slice";
import { MdModeNight } from "react-icons/md";
import { BsSunFill } from "react-icons/bs";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const userName = auth.user?.displayName || "User";
  const expense = useSelector((state) => state.expenseStore);

  const total = expense.items.reduce(
    (sum, item) => sum + Number(item.enteredAmt),
    0
  );

  // Calculate profile completion dynamically
  const totalFields = 2; // displayName and photoUrl
  let filledFields = 0;

  if (auth.user?.displayName) filledFields++;
  if (auth.user?.photoUrl) filledFields++;

  const profileCompletion = Math.round((filledFields / totalFields) * 100);

  const handleLogout = () => {
    if (isDarkMode) {
      dispatch(themeActions.toggleTheme());
    }
    dispatch(authActions.logout());
    dispatch(expenseActions.setItemsEmpty());
    navigate("/", { replace: true });
  };

  const handleExpenseTracker = () => {
    navigate("/expense-tracker", { replace: true });
  };

  const handleProfileClick = () => {
    navigate("/profile", { replace: true });
  };

  const handleThemeToggle = () => {
    dispatch(themeActions.toggleTheme());
  };

  return (
    <Navbar
      expand="lg"
      className="py-2"
      style={{
        backgroundColor: isDarkMode ? "white" : "#f8f9fa", // White in dark mode
        color: isDarkMode ? "black" : "inherit",
      }}
    >
      <Container>
        {/* Left Section - Welcome Text */}
        <Navbar.Brand className="fw-bold">
          Welcome to Expense Tracker, {userName}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex justify-content-center flex-grow-1 align-items-center">
            <Button
              variant="success"
              className="mx-2"
              onClick={handleExpenseTracker}
            >
              Expense Tracker
            </Button>

            {/* Profile Completion */}
            <span className="mx-2 fw-bold text-primary">
              {profileCompletion === 100 ? (
                <>
                  ✅ Profile 100% Complete!
                  <Button
                    variant="link"
                    className="ms-2 text-danger fw-bold"
                    onClick={handleProfileClick}
                  >
                    Edit Now
                  </Button>
                </>
              ) : (
                <>
                  ⚠️ Profile incomplete! ({profileCompletion}% done)
                  <Button
                    variant="link"
                    className="ms-2 text-danger fw-bold"
                    onClick={handleProfileClick}
                  >
                    Complete Now
                  </Button>
                </>
              )}
            </span>

            {/* Theme Toggle Button */}
            {auth.isPremium && (
              <Button
                variant="secondary"
                className="mx-2"
                onClick={handleThemeToggle}
              >
                {isDarkMode ? <BsSunFill /> : <MdModeNight />}
              </Button>
            )}
          </Nav>

          {/* Right Section - Logout Button */}
          <Button variant="danger" className="ms-auto" onClick={handleLogout}>
            Log out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
