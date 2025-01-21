import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Alias for better readability
import "./App.css";
import Expense from "./Components/Expense/Expense";
import RootLayout from "./Components/Layout/Root";
import Profile from "./Components/Profile/Profile";
import SignupLogin from "./Components/SignUpLogin/SignUpLogin";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  console.log(isLoggedIn);
  return (
    <Router>
      <div
        className={`App ${
          isLoggedIn && isDarkMode ? "darkTheme" : "lightTheme"
        }`}
      >
        <Routes>
          <Route path="/" element={<SignupLogin />} />
          {isLoggedIn && <Route path="/profile" element={<Profile />} />}
          {isLoggedIn && (
            <Route path="/profile/expense-tracker" element={<RootLayout />}>
              <Route index element={<Expense />} />
            </Route>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
