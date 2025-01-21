import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Container, Image, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { authActions } from "../Context/auth-slice";
import { expenseActions } from "../Context/expense-slice";
import UpdateProfileForm from "../Profile/UpdatedProfile";
import { themeActions } from "../Context/theme-slice";
import { MdModeNight } from "react-icons/md";
import { BsSunFill } from "react-icons/bs";

const Profile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLocation = location.pathname === "/profile";

  // Function to calculate profile completion percentage
  const calculateProfileCompletion = (userData) => {
    let totalFields = 0;
    let filledFields = 0;

    // Check if displayName is available
    if (userData?.displayName) {
      filledFields += 1;
    }
    totalFields += 1;

    // Check if email is available
    if (userData?.email) {
      filledFields += 1;
    }
    totalFields += 1;

    // Check if profile picture is available
    if (userData?.photoUrl) {
      filledFields += 1;
    }
    totalFields += 1;

    // Calculate percentage
    return Math.round((filledFields / totalFields) * 100);
  };

  const updateVisibleHandler = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: auth.token,
          }),
        }
      );
      const data = await res.json();
      setUserData(data.users[0]);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    updateVisibleHandler();
  }, []);

  const clickLogoutHandler = () => {
    if (isDarkMode) {
      dispatch(themeActions.toggelTheme());
    }
    dispatch(authActions.logout());
    dispatch(expenseActions.setItemsEmpty());
    navigate("/", { replace: true });
  };

  const clickExpenseHandler = () => {
    navigate("/profile/expense-tracker", { replace: true });
  };

  const clickModeHandler = () => {
    dispatch(themeActions.toggelTheme());
  };

  const profileCompletion = userData ? calculateProfileCompletion(userData) : 0;

  return (
    <Fragment>
      <Container className="my-4">
        <Card
          className={`p-4 d-flex flex-row align-items-center justify-content-between ${
            isDarkMode ? "bg-dark text-white" : "bg-light"
          }`}
        >
          {/* Profile Image */}
          <Col xs="auto" className="mb-2 mb-md-0">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
              roundedCircle
              fluid
              style={{ width: "150px", height: "150px" }}
            />
          </Col>

          {/* Profile Details */}
          <Col className="d-flex flex-column align-items-start">
            {/* Row for "Welcome" and "Name" */}
            <Row className="mb-1">
              <Col xs="auto">
                <h4>Welcome to Expense Tracker</h4>
              </Col>
              <Col xs="auto">
                <h5>{userData?.displayName || "Unknown"}</h5>
              </Col>
            </Row>

            {/* Row for Profile completion message */}
            <Row className="mb-1">
              <Col xs={12}>
                <p>
                  {!isLocation ? (
                    "Your Profile is incomplete."
                  ) : (
                    <>
                      Your profile is <strong>{profileCompletion}%</strong>{" "}
                      completed.
                    </>
                  )}
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/profile", { replace: true })}
                >
                  Complete now
                </Button>
              </Col>
            </Row>

            {/* Row for Buttons (Expense Tracker, Dark Mode, Logout) */}
            <Row className="mb-2 d-flex justify-content-between">
              <Col xs="auto">
                <Button
                  variant="success"
                  className="w-100"
                  onClick={clickExpenseHandler}
                >
                  Expense Tracker
                </Button>
              </Col>
              <Col xs="auto">
                {auth.isPremium && (
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={clickModeHandler}
                  >
                    {isDarkMode ? <BsSunFill /> : <MdModeNight />}
                  </Button>
                )}
              </Col>
              <Col xs="auto">
                <Button
                  variant="danger"
                  className="w-100"
                  onClick={clickLogoutHandler}
                >
                  Log out
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Container>

      <Container>
        {isLocation && (
          <UpdateProfileForm user={userData} update={updateVisibleHandler} />
        )}
      </Container>
    </Fragment>
  );
};

export default Profile;
