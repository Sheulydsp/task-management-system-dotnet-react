import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    setToken(tokenFromUrl);
  }
}, []);

  const resetPassword = async () => {
    if (!token || !newPassword) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Auth/reset-password", {
        token,
        newPassword
      });

      alert("Password reset successful");

      navigate("/login");

    } catch (err: any) {
      alert(err.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#0f172a" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Reset Password</h3>

        <div className="mb-3">
          <label>Reset Token</label>
          <input
            className="form-control"
            value={token}
            disabled
            />
        </div>

        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success w-100"
          onClick={resetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}