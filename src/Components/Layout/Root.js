import React from "react";
import { Outlet } from "react-router-dom";
import Profile from "../Profile/Profile";

const RootLayout = () => {
  return (
    <div>
      {/* The child route (Expense component) will be rendered here */}
      <Profile />
      <Outlet />
    </div>
  );
};

export default RootLayout;
