import { useState } from "react";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const sendReset = async () => {
  if (!email) {
    alert("Please enter email");
    return;
  }

  try {
    setLoading(true);

    // ✅ FIXED HERE
    const res = await api.post("/Auth/forgot-password", {
      email: email
    });

    // handle token safely
    if (res.data.token) {
      //setToken(res.data.token);
      window.location.href = `/reset-password?token=${res.data.token}`;
    } else {
      setToken("");
    }

    alert("If this email exists, a reset link has been sent");

  } catch {
    alert("Something went wrong");
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
        <h3 className="text-center mb-3">Forgot Password</h3>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={sendReset}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* 🔥 SHOW TOKEN (DEV ONLY) */}
        {token && (
          <div className="mt-3">
            <small className="text-muted">Reset Token:</small>
            <div className="p-2 bg-light mt-1" style={{ wordBreak: "break-all" }}>
              {token}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}