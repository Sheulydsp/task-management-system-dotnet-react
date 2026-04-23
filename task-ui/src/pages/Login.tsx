import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
  const expired = localStorage.getItem("sessionExpired");

  if (expired) {
    setSessionExpired(true);
    localStorage.removeItem("sessionExpired");
  }
}, []);


  

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/Auth/login", { email, password });

      const token = res.data.token;

      if (!token) {
        alert("Invalid login response");
        return;
      }

      localStorage.setItem("token", token);

      window.location.href = "/dashboard"; // ✅ FIX

    } catch (err) {
      alert("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#0f172a" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4">Welcome Back</h3>
        {sessionExpired && (
        <div className="alert alert-warning text-center">
          Session expired. Please login again.
        </div>
      )}

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>


        

      <div className="d-flex justify-content-between mt-3">

        <span
          style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
          onClick={() => navigate("/register")}
        >
          Create Account
        </span>

        <span
          style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </span>

      </div>
          </div>
        </div>
  );
}