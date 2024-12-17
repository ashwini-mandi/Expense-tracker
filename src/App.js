import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserForm from "./Components/Form";
import WelcomeScreen from "./Components/Welcome";
import CompleteProfile from "./Components/Profile";
import Password from "./Components/Password";
import Expense from "./Components/Expense";

function App() {
  return (
    <div className="App">
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
  );
}

export default App;
