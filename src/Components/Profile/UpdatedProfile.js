import React, { useEffect, useRef } from "react";
import { Button, Form, Card, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { authActions } from "../Context/auth-slice"; // assuming this is where the update action is defined

const UpdateProfileForm = (props) => {
  const dispatch = useDispatch(); // Get the dispatch function
  let emailInputRef = useRef();
  let nameInputRef = useRef();
  const photoUrlInputRef = useRef();

  useEffect(() => {
    if (props.user) {
      if (props.user.displayName)
        nameInputRef.current.value = props.user.displayName;
      emailInputRef.current.value = props.user.email;
      if (props.user.photoUrl)
        photoUrlInputRef.current.value = props.user.photoUrl;
    }
  }, [props.user]);

  const clickUpdateHandler = async (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredPhotoUrl = photoUrlInputRef.current.value;

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: localStorage["user"],
            displayName: enteredName,
            photoUrl: enteredPhotoUrl,
            returnSecureToken: true,
          }),
          headers: { "content-type": "application/json" },
        }
      );

      const upData = await res.json();
      if (res.ok) {
        alert("Profile Updated");
        // Dispatch the updated user data to the Redux store
        dispatch(
          authActions.updateUser({
            displayName: enteredName,
            photoUrl: enteredPhotoUrl,
          })
        );
      } else {
        throw new Error("Updation failed! Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                ref={emailInputRef}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                ref={nameInputRef}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Photo URL"
                ref={photoUrlInputRef}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={clickUpdateHandler}
              className="w-100"
            >
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateProfileForm;
