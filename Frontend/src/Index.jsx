import { useState } from "react";
import "./index.css";
// import Login from "./Login.jsx";
import { Link } from "react-router-dom";

function Index() {
    const [role, setRole] = useState("owner");
    const [loginMode, setLoginMode] = useState(false);

    // Car Owner fields
    const [ownerName, setOwnerName] = useState("");
    const [ownerMobile, setOwnerMobile] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");

    // Mechanic fields (kept separate)
    const [mechName, setMechName] = useState("");
    const [mechMobile, setMechMobile] = useState("");
    const [mechEmail, setMechEmail] = useState("");
    const [mechPassword, setMechPassword] = useState("");
    const [mechGarageName, setMechGarageName] = useState("");
    const [mechGarageDescription, setMechGarageDescription] = useState("");
    const [mechLocation, setMechLocation] = useState({
        latitude: null,
        longitude: null,
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setSuccessMessage("");
        setErrorMessage("");
        setLoginMode(false);

        // Reset fields when switching roles
        setOwnerName("");
        setOwnerMobile("");
        setOwnerEmail("");
        setOwnerPassword("");

        setMechName("");
        setMechMobile("");
        setMechEmail("");
        setMechPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        let payload = { role };

        if (role === "owner") {
            payload = {
                role,
                name: ownerName,
                mobile: ownerMobile,
                email: ownerEmail,
                password: ownerPassword,
            };
        } else {
            payload = {
                role,
                name: mechName,
                mobile: mechMobile,
                email: mechEmail,
                password: mechPassword,
                garageName: mechGarageName,
                garageDescription: mechGarageDescription,
                latitude: mechLocation.latitude,
                longitude: mechLocation.longitude,
            };
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/api/user-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to submit details.");
            }

            setSuccessMessage(data.message || "Details submitted successfully.");
        } catch (err) {
            setErrorMessage(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const isOwner = role === "owner";

    return (
        <div className="app-container">
            <div className="card">
                <h1 className="title">Vehicle Breakdown – Login / Details</h1>

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button
                        type="button"
                        onClick={() => handleRoleChange("owner")}
                        className={`role-btn ${isOwner ? "active" : ""}`}
                    >
                        Car Owner
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleChange("mechanic")}
                        className={`role-btn ${!isOwner ? "active" : ""}`}
                    >
                        Mechanic
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* OWNER FIELDS */}
                    {isOwner && (
                        <div key="owner-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    autoComplete="off"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mobile *</label>
                                <input
                                    type="tel"
                                    name="ownerMobile"
                                    autoComplete="off"
                                    value={ownerMobile}
                                    onChange={(e) => setOwnerMobile(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="ownerEmail"
                                    autoComplete="off"
                                    value={ownerEmail}
                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="ownerPassword"
                                    autoComplete="off"
                                    value={ownerPassword}
                                    onChange={(e) => setOwnerPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* MECHANIC FIELDS */}
                    {!isOwner && (
                        <div key="mechanic-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="mechName"
                                    autoComplete="off"
                                    value={mechName}
                                    onChange={(e) => setMechName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mobile *</label>
                                <input
                                    type="tel"
                                    name="mechMobile"
                                    autoComplete="off"
                                    value={mechMobile}
                                    onChange={(e) => setMechMobile(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="mechEmail"
                                    autoComplete="off"
                                    value={mechEmail}
                                    onChange={(e) => setMechEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="mechPassword"
                                    autoComplete="off"
                                    value={mechPassword}
                                    onChange={(e) => setMechPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Garage Name *</label>
                                <input
                                    type="text"
                                    name="mechGarageName"
                                    autoComplete="off"
                                    value={mechGarageName}
                                    onChange={(e) => setMechGarageName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Garage Description *</label>
                                <input
                                    type="text"
                                    name="mechGarageDescription"
                                    autoComplete="off"
                                    value={mechGarageDescription}
                                    onChange={(e) => setMechGarageDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Garage Location *</label>

                                {/* Get Current Location */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (pos) => {
                                                    setMechLocation({
                                                        latitude: pos.coords.latitude,
                                                        longitude: pos.coords.longitude,
                                                    });
                                                },
                                                () => {
                                                    alert("Unable to fetch location. Please allow location access.");
                                                }
                                            );
                                        }
                                    }}
                                    className="location-btn"
                                >
                                    📍 Get Current Location
                                </button>

                                {/* Set Location on Map */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.open("https://www.google.com/maps", "_blank");
                                    }}
                                    className="location-btn secondary"
                                >
                                    📌 Set Location on Map
                                </button>

                                <small className="hint">
                                    Right-click on map → <b>What’s here?</b> → copy latitude & longitude
                                </small>

                                {/* Manual coordinate input */}
                                <div className="manual-location">
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Latitude"
                                        value={mechLocation.latitude || ""}
                                        onChange={(e) =>
                                            setMechLocation((prev) => ({
                                                ...prev,
                                                latitude: e.target.value,
                                            }))
                                        }
                                        required
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Longitude"
                                        value={mechLocation.longitude || ""}
                                        onChange={(e) =>
                                            setMechLocation((prev) => ({
                                                ...prev,
                                                longitude: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                {/* Show on Map */}
                                {mechLocation.latitude && mechLocation.longitude && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const mapUrl = `https://www.google.com/maps?q=${mechLocation.latitude},${mechLocation.longitude}`;
                                            window.open(mapUrl, "_blank");
                                        }}
                                        className="map-btn"
                                    >
                                        🗺️ Show on Map
                                    </button>
                                )}
                            </div>


                        </div>
                    )}

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading
                            ? "Submitting..."
                            : isOwner
                                ? "Sign Up as Car Owner"
                                : "Sign up as Mechanic"}
                    </button>

                    {successMessage && (
                        <div className="success-message">{successMessage} <Link
                            className="toggle-link"
                            to="/login"
                            state={{ role: isOwner ? "owner" : "mechanic" }}
                        >
                            Login
                        </Link> </div>
                    )}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
                <div className="login-toggle">
                    {loginMode ? (
                        <p>
                            Don't have an account?{" "}
                            <span className="toggle-link" onClick={() => setLoginMode(false)}>
                                Sign Up as {isOwner ? "Car Owner" : "Mechanic"}
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <Link
                                className="toggle-link"
                                to="/login"
                                state={{ role: isOwner ? "owner" : "mechanic" }}
                            >
                                Login
                            </Link>{" "}
                            as {isOwner ? "Car Owner" : "Mechanic"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Index;