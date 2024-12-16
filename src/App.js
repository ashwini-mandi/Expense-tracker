import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserForm from "./Components/Form";
import WelcomeScreen from "./Components/Welcome";
import CompleteProfile from "./Components/Profile";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
