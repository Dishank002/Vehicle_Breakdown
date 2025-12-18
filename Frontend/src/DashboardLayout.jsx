import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Car_Owner_Dashboard.css";
import Logo from "./Images/Logo2.png";

const DashboardLayout = () => {
  const userName = localStorage.getItem("userName") || "";

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/Car_Owner_Dashboard">
            <img src={Logo} alt="Project Logo" className="Logo" />
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/New_Request">
            <button className="nav-button">New Request</button>
          </Link>

          <div>Welcome, {userName}</div>
        </div>
      </nav>

      {/* Child pages render here */}
      <Outlet />
    </>
  );
};

export default DashboardLayout;
