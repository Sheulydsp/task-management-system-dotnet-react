import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role;

  return (
    <div
      style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        height: "100vh"
      }}
    >
      <h4>TaskFlow</h4>
      <hr />

      {/* COMMON */}
      <p style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        Dashboard
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/tasks/pending")}>
        Pending Tasks
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/tasks/completed")}>
        Completed Tasks
      </p>

      {/* ADMIN ONLY */}
      {role === "Admin" && (
        <>
          <hr />
          <p style={{ cursor: "pointer" }} onClick={() => navigate("/projects")}>
            Projects
          </p>

          <p style={{ cursor: "pointer" }} onClick={() => navigate("/tasks/create")}>
            Create Task
          </p>
        </>
      )}
    </div>
  );
}