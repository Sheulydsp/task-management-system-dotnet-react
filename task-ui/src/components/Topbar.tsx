import { getCurrentUser } from "../utils/auth";
import api from "../api/api";
import { useEffect, useState } from "react";

export default function Topbar() {

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);


const fetchNotifications = async () => {
  const res = await api.get("/Notifications");
  setNotifications(res.data);
};

useEffect(() => {
  let isMounted = true;

  const load = async () => {
    const resUser = await api.get("/Users/me");
    if (isMounted) setUser(resUser.data);

    const resNotif = await api.get("/Notifications");
    if (isMounted) setNotifications(resNotif.data);
  };

  load();

  const interval = setInterval(async () => {
    const res = await api.get("/Notifications");
    if (isMounted) setNotifications(res.data);
  }, 5000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

const fetchUser = async () => {
  const res = await api.get("/Users/me");
  setUser(res.data);
};
  


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4"
      style={{
        height: "60px",
        background: "white",
        borderBottom: "1px solid #ddd"
      }}
    >
      <h5 className="mb-0">Dashboard</h5>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-3">

        {user?.profileImageUrl ? (
  <img
    src={`http://localhost:5152${user.profileImageUrl}`}
    alt="profile"
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "1px solid #ddd"
    }}
  />
) : (
  <div
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      background: "#1e293b",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold"
    }}
  >
    {user?.name?.charAt(0)}
  </div>
)}

        {/* USER INFO */}
        <div className="d-flex flex-column">
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            {user?.name}
          </span>
         
        </div>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => window.location.href = "/profile"}>
          Profile
        </button>

        {/* LOGOUT */}
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={logout}
        >
          Logout
        </button>

        <div style={{ position: "relative" }}>
          <div style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
            🔔
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span
                className="badge bg-danger"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  fontSize: "10px"
                }}
              >
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>

          {open && (
  <div
    style={{
      position: "absolute",
      right: 0,
      top: "40px", // 🔥 this places it BELOW bell
      width: "300px",
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      zIndex: 1000 // 🔥 VERY IMPORTANT
    }}
  >
    {notifications.length === 0 ? (
      <div className="p-2 text-muted">No notifications</div>
    ) : (
      notifications.map(n => (
  <div
    key={n.id}
    className="p-2 border-bottom"
    style={{
      background: n.isRead ? "white" : "#f1f5f9",
      cursor: "pointer"
    }}
    onClick={async () => {
      try {
        await api.patch(`/Notifications/${n.id}/read`);

        // 🔥 Update UI instantly (no wait for polling)
        setNotifications(prev =>
          prev.map(x =>
            x.id === n.id ? { ...x, isRead: true } : x
          )
        );

      } catch {
        alert("Failed to mark as read");
      }
    }}
  >
    {n.message}
  </div>
))
    )}
  </div>
)}
        </div>

      </div>
    </div>
  );
}