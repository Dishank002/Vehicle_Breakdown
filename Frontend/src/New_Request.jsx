import { useState } from "react";
import { useNavigate } from "react-router-dom";

function New_Request() {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [carModel, setCarModel] = useState("");
    const [issue, setIssue] = useState("");
    const [mechLocation, setMechLocation] = useState({ latitude: "", longitude: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData ={
            requester_name: name,
            requester_mobile: mobile,
            car_model: carModel,
            car_issue: issue,
            latitude: mechLocation.latitude,
            longitude: mechLocation.longitude,
            status: "Pending",
            id_co_owner: localStorage.getItem("ownerId"),
            id_mechanic: null
        };
        console.log("Request Data:", requestData);
        try {
            const response = await fetch("http://127.0.0.1:5000/api/car-issues", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Request submitted successfully!");
            navigate("/Car_Owner_Dashboard");
        }else{
            alert("Something went wrong, Failed to submit request: " + result.message);
        }
    } catch (error) {
        console.error("Error submitting request:", error);
        alert("An error occurred while submitting the request.");
    }
};


    return (
        <div
            className="card-container"
            style={{
                color: "white",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#0f172a",
            }}
        >
            <div className="card" style={{ margin: "25px" }}>
                <center>
                    <h1 className="title">Vehicle Breakdown Request</h1>
                </center>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Requester Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Requester Mobile Number *</label>
                        <input
                            type="Numeric"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Car Model *</label>
                        <input
                            type="text"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Issue *</label>
                        <textarea
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            required
                            rows={4} // Adjust number of rows as needed
                            style={{ width: "100%", borderRadius: "0.75rem", backgroundColor: "#1e293b", color: "white", fontSize: "1rem" }}
                        />
                    </div>

                    {/* Location UI */}
                    <div className="form-group">
                        <label>Car Location *</label>

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
                                } else {
                                    alert("Geolocation is not supported by your browser.");
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
                        <div className="manual-location" style={{ marginTop: "10px" }}>
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
                                style={{ marginRight: "10px", width: "48%" }}
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
                                style={{ width: "48%" }}
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
                                style={{ marginTop: "10px" }}
                            >
                                🗺️ Show on Map
                            </button>
                        )}
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default New_Request;
