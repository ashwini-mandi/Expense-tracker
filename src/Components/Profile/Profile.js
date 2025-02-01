import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import UpdateProfileForm from "../Profile/UpdatedProfile";

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCUjLjnpRxGDfU1vWmhDafxL3sC22a-oms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: auth.token }),
        }
      );
      const data = await res.json();
      setUserData(data.users[0]);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <Container className="my-4">
      <UpdateProfileForm user={userData} update={fetchUserProfile} />
    </Container>
  );
};

export default Profile;
