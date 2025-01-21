import React, { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";

const UpdateProfileForm = (props) => {
  let emailInputRef = useRef();
  let nameInputRef = useRef();
  const contactInputRef = useRef();
  const locationInputRef = useRef();

  // Fetch user data when it is available (to pre-fill the form)
  useEffect(() => {
    if (props.user) {
      if (props.user.displayName) {
        nameInputRef.current.value = props.user.displayName;
      }
      emailInputRef.current.value = props.user.email;
    }
  }, [props.user]);

  const clickUpdateHandler = async (event) => {
    event.preventDefault();

    // Get the entered data from the input fields
    const enteredName = nameInputRef.current.value;
    const enteredContact = contactInputRef.current.value;
    const enteredLocation = locationInputRef.current.value;

    // Debugging: Log the values to check if the correct data is being entered
    console.log("Entered Name: ", enteredName);
    console.log("Entered Contact: ", enteredContact);
    console.log("Entered Location: ", enteredLocation);

    try {
      // Send a POST request to update the profile data
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms", // Use your correct API key
        {
          method: "POST",
          body: JSON.stringify({
            idToken: localStorage["user"], // Ensure user token is available in localStorage
            displayName: enteredName,
            contact: enteredContact, // Send the entered contact as part of the request body
            location: enteredLocation, // Send the entered location as part of the request body
            returnSecureToken: true,
          }),
          headers: {
            "content-type": "application/json",
          },
        }
      );

      // Parse the response
      const upData = await res.json();

      // If the response is OK, update the profile
      if (res.ok) {
        alert("Profile Updated");
        props.update(); // Callback function to update the parent component state
        nameInputRef.current.value = props.user.displayName;
        emailInputRef.current.value = props.user.email;
      } else {
        throw new Error("Updation failed! Please try again.");
      }
    } catch (error) {
      alert(error.message); // Alert if any error occurs
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
          <Form.Label>Contact No.:</Form.Label>
          <Form.Control placeholder="Contact No." ref={contactInputRef} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Location: </Form.Label>
          <Form.Control placeholder="Location" ref={locationInputRef} />
        </Form.Group>
        <Button type="submit" onClick={clickUpdateHandler}>
          Update
        </Button>
      </Form>
    </section>
  );
};

export default UpdateProfileForm;
