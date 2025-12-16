import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  // Receive role from query param or state
  const roleFromState = location.state?.role || "owner";
  const [role, setRole] = useState(roleFromState);

  const isOwner = role === "owner";

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to respective dashboard
      if (role === "owner") {
        localStorage.setItem("userName", data.name);
        navigate("/Car_Owner_Dashboard");
      } else {
        localStorage.setItem("userName", data.name);
        navigate("/Mechanic_Dashboard");
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Vehicle Breakdown – Login</h1>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`role-btn ${isOwner ? "active" : ""}`}
          >
            Car Owner
          </button>
          <button
            type="button"
            onClick={() => setRole("mechanic")}
            className={`role-btn ${!isOwner ? "active" : ""}`}
          >
            Mechanic
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Logging in..." : `Login as ${isOwner ? "Owner" : "Mechanic"}`}
          </button>
          <p>
            Don't have an account?{" "}
            <Link
              className="toggle-link"
              to="/"
              state={{ role: isOwner ? "owner" : "mechanic" }}
            >
              Sign Up
            </Link>{" "}
            as {isOwner ? "Car Owner" : "Mechanic"}
          </p>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
