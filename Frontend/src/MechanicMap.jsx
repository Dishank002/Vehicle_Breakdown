import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Tooltip } from "react-leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Haversine distance
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// AutoZoom component
const AutoZoom = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    const lat = userLocation.latitude;
    const lng = userLocation.longitude;

    const latOffset = 15 / 111;
    const lngOffset = 15 / (111 * Math.cos((lat * Math.PI) / 180));

    const bounds = [
      [lat - latOffset, lng - lngOffset],
      [lat + latOffset, lng + lngOffset],
    ];

    map.fitBounds(bounds);
    const minZoom = map.getZoom();
    const initialZoom = Math.min(minZoom + 3, 20);

    map.setView([lat, lng], initialZoom);
    map.setMinZoom(minZoom);
    map.setMaxZoom(20);
  }, [userLocation, map]);

  return null;
};

const MechanicMap = () => {
  const [mechanics, setMechanics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Fetch mechanics
  useEffect(() => {
    fetch("http://localhost:5000/api/mechanics")
      .then((res) => res.json())
      .then((data) => setMechanics(data))
      .catch(console.error);
  }, []);

  // Request user location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
  (pos) => {
    setUserLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  },
  (err) => {
    console.error(err);
    setShowLocationPrompt(true);
  },
  {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  }
);

  };

  // Check permissions on load
  useEffect(() => {
  if (!navigator.permissions) {
    // Fallback: show prompt asynchronously
    setTimeout(() => setShowLocationPrompt(true), 0);
    return;
  }

  navigator.permissions
    .query({ name: "geolocation" })
    .then((permissionStatus) => {
      if (permissionStatus.state === "granted") {
        requestLocation();
      } else if (permissionStatus.state === "prompt") {
        setTimeout(() => setShowLocationPrompt(true), 0);
      } else {
        // denied
        setTimeout(() => setShowLocationPrompt(true), 0);
      }

      // Listen for changes in permission
      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          requestLocation();
        }
      };
    });
}, []);

  // Mechanics within 15 km
  const visibleMechanics = useMemo(() => {
    if (!userLocation) return mechanics;
    return mechanics.filter((mech) => {
      const distance = getDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        mech.Latitude,
        mech.Longitude
      );
      return distance <= 15;
    });
  }, [mechanics, userLocation]);

  return (
    <div>
      {showLocationPrompt && (
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <button
            onClick={requestLocation}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
          >
            Enable Location
          </button>
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && <AutoZoom userLocation={userLocation} />}

        {/* User marker */}
        {userLocation && (
  <Marker
    position={[userLocation.latitude, userLocation.longitude]}
    icon={redIcon}
  >
    <Popup>You are here</Popup>
  </Marker>
)}


        {/* Mechanics */}
        {visibleMechanics.map((mech, index) => (
  <Marker key={index} position={[mech.Latitude, mech.Longitude]}>
    
    {/* Always visible */}
    <Tooltip permanent direction="top" offset={[0, -20]}>
      <strong>{mech.MN_Garage_Name}</strong>
    </Tooltip>

    {/* On click */}
    <Popup>
      <strong>Name:</strong> {mech.MN_Name}
      <br />
      <strong>Garage:</strong> {mech.MN_Garage_Name}
      <br />
      <strong>Mobile:</strong> {mech.MN_Mobile_No}
    </Popup>
  </Marker>
))}

      </MapContainer>
    </div>
  );
};

export default MechanicMap;
