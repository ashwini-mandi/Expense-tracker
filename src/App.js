import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserForm from "./Components/Form";
import WelcomeScreen from "./Components/Welcome";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for the UserForm */}
          <Route path="/" element={<UserForm />} />
          {/* Route for the WelcomeScreen */}
          <Route path="/welcome" element={<WelcomeScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
