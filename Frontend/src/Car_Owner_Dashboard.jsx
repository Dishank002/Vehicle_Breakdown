import React from "react";
import "./Car_Owner_Dashboard.css";
import Logo from "./Images/Logo2.png";
import { Link } from "react-router-dom";
import MechanicMap from "./MechanicMap";


const Car_Owner_Dashboard = () => {
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
  }

  
},[]);
  return (
    <>
    <nav className="navbar">
      <div className="logo">
        <Link to="/Car_Owner_Dashboard">
          <img src={Logo} alt="Project Logo" className="Logo"/>
        </Link>
      </div>
      <div className="nav-right">
        <button className="nav-button">New Request</button>
        <div>Welcome, {userName}</div>
      </div>
    </nav>
    <div>
      {/* <h1><center>Car Owner Dashboard</center></h1> */}
      <MechanicMap />
    </div>
    </>
  );
};

export default Car_Owner_Dashboard;
