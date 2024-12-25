import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserForm from "./Components/Form";
import WelcomeScreen from "./Components/Welcome";
import CompleteProfile from "./Components/Profile";
import Password from "./Components/Password";
import Expense from "./Components/Expense";
import { toggleTheme } from "./Components/themeReducer";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const isDarkTheme = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <div
        style={{
          backgroundColor: isDarkTheme ? "#333" : "#fff",
          color: isDarkTheme ? "#fff" : "#000",
          minHeight: "100vh",
        }}
      >
        <button onClick={() => dispatch(toggleTheme())}>
          Switch to {isDarkTheme ? "Light" : "Dark"} Theme
        </button>
        <Router>
          <Routes>
            {/* Route for the UserForm */}
            <Route path="/" element={<UserForm />} />
            {/* Route for the WelcomeScreen */}
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/profile" element={<CompleteProfile />} />
            <Route path="/forgot-password" element={<Password />} />
            <Route path="/add-expense" element={<Expense />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
