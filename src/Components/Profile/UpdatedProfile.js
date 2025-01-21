import React, { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";

const UpdateProfileForm = (props) => {
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
        // Pass the updated data back to the parent component to re-fetch user data
        props.update({
          ...props.user,
          displayName: enteredName,
          photoUrl: enteredPhotoUrl,
        });
      } else {
        throw new Error("Updation failed! Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section>
      <h1>Update profile</h1>
      <Form>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control placeholder="Email" ref={emailInputRef} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Full Name:</Form.Label>
          <Form.Control placeholder="Full Name" ref={nameInputRef} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Photo URL:</Form.Label>
          <Form.Control placeholder="Photo URL" ref={photoUrlInputRef} />
        </Form.Group>
        <Button type="submit" onClick={clickUpdateHandler}>
          Update
        </Button>
      </Form>
    </section>
  );
};

export default UpdateProfileForm;
