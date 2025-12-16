import React from "react";
import "./Mechanic_Dashboard.css";
import Logo from "./Images/Logo2.png";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [userName, setUserName] = React.useState("");

    React.useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }
    }, []);
    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <Link to="/Mechanic_Dashboard">
                        <img src={Logo} alt="Project Logo" className="Logo" />
                    </Link>
                </div>
                <div className="nav-right">
                    <button className="nav-button">Requests</button>
                    <div>Welcome, {userName}</div>
                </div>
            </nav>
            <div>
                <h1><center>Mechanic Dashboard</center></h1>
            </div>
        </>
    );
};

export default Navbar;
