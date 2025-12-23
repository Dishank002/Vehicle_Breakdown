import React from "react";
import "./Car_Owner_Dashboard.css";
import Logo from "./Images/Logo2.png";
import { Link } from "react-router-dom";
import MechanicMap from "./MechanicMap";
import RequestStatusSidebar from "./RequestStatusSidebar";

const Car_Owner_Dashboard = () => {
  const [userName, setUserName] = React.useState("");
  const [userLocation, setUserLocation] = React.useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [requestData, setRequestData] = React.useState(null);

  React.useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  // 🔹 Location request (moved here)
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setShowLocationPrompt(false);
      },
      () => setShowLocationPrompt(true),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  React.useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;

    fetch(`http://127.0.0.1:5000/api/car-issues/${ownerId}`)
      .then(res => res.json())
      .then(data => setRequestData(data))
      .catch(err => console.error("Error fetching request status:", err));
  }, []);

  // 🔹 Permission check
  React.useEffect(() => {
    if (!navigator.permissions) {
      setShowLocationPrompt(true);
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (status.state === "granted") {
          requestLocation();
        } else {
          setShowLocationPrompt(true);
        }

        status.onchange = () => {
          if (status.state === "granted") {
            requestLocation();
          }
        };
      });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/Car_Owner_Dashboard">
            <img src={Logo} alt="Project Logo" className="Logo" />
          </Link>
        </div>

        <div className="nav-right">
          {/* 🔴 Enable Location Button */}
          {showLocationPrompt && (
            <button
              className="nav-button"
              onClick={requestLocation}
            >
              Enable Location
            </button>
          )}
          <Link to="#">
            <button className="nav-button">Book Service</button>
          </Link>
          <Link to="/New_Request">
            <button className="nav-button">New Request</button>
          </Link>
          <div>Welcome, {userName}</div>
        </div>
      </nav>
      <button
  className="request-status-btn"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  {sidebarOpen ? "Request Status >>" : "<< Request Status"}
</button>


<RequestStatusSidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  requestStatus={requestData}
/>

      <MechanicMap userLocation={userLocation} />
    </>
  );
};

export default Car_Owner_Dashboard;
