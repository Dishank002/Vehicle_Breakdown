import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Login from "./Login";
import Car_Owner_Dashboard from "./Car_Owner_Dashboard";
import Mechanic_Dashboard from "./Mechanic_Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Car_Owner_Dashboard" element={<Car_Owner_Dashboard />} />
        <Route path="/Mechanic_Dashboard" element={<Mechanic_Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
