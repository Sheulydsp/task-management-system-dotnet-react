import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import type { Task } from "../types/Task";
import { getCurrentUser } from "../utils/auth";
import type { TaskActivity } from "../types/TaskActivity";

export default function TaskDetails() {
  const { id } = useParams();

  const [task, setTask] = useState<Task | null>(null);
  const [activities, setActivities] = useState<TaskActivity[]>([]);

  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const user = getCurrentUser();

  useEffect(() => {
    fetchTask();
    fetchActivity();
  }, [id]);

  const fetchTask = async () => {
    const res = await api.get(`/Tasks/${id}`);
    setTask(res.data);
  };

  const fetchActivity = async () => {
    const res = await api.get(`/Tasks/${id}/activity`);
    setActivities(res.data);
  };

  // 🎯 ICON BASED ON ACTION
  const getIcon = (action: string) => {
    const text = action.toLowerCase();

    if (text.includes("created")) return "🟢";
    if (text.includes("updated")) return "🔵";
    if (text.includes("assigned")) return "🟡";
    if (text.includes("status")) return "🟣";

    return "📝";
  };

  // 🎯 TIME FORMAT
  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    return new Date(date).toLocaleDateString();
  };

  // CHANGE STATUS
  const changeStatus = async (newStatus: string) => {
    if (!task) return;

    try {
      await api.patch("/Tasks/status", {
        taskId: task.id,
        newStatus:
          newStatus === "Todo" ? 0 :
          newStatus === "InProgress" ? 1 : 2,
        rowVersion: task.rowVersion
      });

      await fetchTask();
      await fetchActivity();

    } catch {
      alert("Status update failed");
    }
  };

  // UPDATE TASK
  const updateTask = async () => {
    if (!task) return;

    try {
      await api.put(`/Tasks/${task.id}`, {
        title: editTitle,
        description: editDesc,
        priority:
          task.priority === "Low" ? 0 :
          task.priority === "Medium" ? 1 : 2,
        dueDate: editDueDate || null,
        rowVersion: task.rowVersion
      });

      setShowEdit(false);

      await fetchTask();
      await fetchActivity();

    } catch (err: any) {
      alert(err.response?.data || "Update failed");
    }
  };

  if (!task) return <div className="p-4">Loading...</div>;

  const canChangeStatus =
    user?.role === "Admin" ||
    user?.name === task.assigneeName;

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />

        <div className="p-4">

          {/* ACTIVITY LOG */}
          <div className="card p-4 mt-4">
            <h5>Activity Log</h5>

            {activities.length === 0 ? (
              <p className="text-muted">No activity yet</p>
            ) : (
              activities.map((a) => (
                <div
                  key={a.id}
                  className="d-flex align-items-start gap-3 py-2"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <div className="bg-light rounded-circle p-2">
                    {getIcon(a.action)}
                  </div>

                  <div>
                    <div style={{ fontWeight: "500" }}>
                      {a.action}
                    </div>
                    <small className="text-muted">
                      {formatTime(a.createdAt)}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h3>{task.title}</h3>

            <div className="d-flex gap-2">
              <span className={`badge ${
                task.status === "Done"
                  ? "bg-success"
                  : task.status === "InProgress"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
              }`}>
                {task.status}
              </span>

              <span className={`badge ${
                task.priority === "High"
                  ? "bg-danger"
                  : task.priority === "Medium"
                  ? "bg-warning text-dark"
                  : "bg-success"
              }`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="card p-3 mb-4 shadow-sm">
            <h5>Description</h5>
            <p>{task.description || "No description provided"}</p>
          </div>

          {/* META */}
          <div className="row g-3">

            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <strong>Assigned To</strong>
                <p>{task.assigneeName || "Unassigned"}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <strong>Created By</strong>
                <p>{task.createdByName}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <strong>Due Date</strong>
                <p>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <strong>Created At</strong>
                <p>{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="mt-4 d-flex gap-2">

            {canChangeStatus && (
              <select
                className="form-select w-auto"
                value={task.status}
                onChange={(e) => changeStatus(e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            )}

            {user?.role === "Admin" && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditTitle(task.title);
                  setEditDesc(task.description);
                  setEditDueDate(task.dueDate?.slice(0, 10) || "");
                  setShowEdit(true);
                }}
              >
                Edit Task
              </button>
            )}

          </div>

          {/* EDIT MODAL */}
          {showEdit && (
            <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content p-3">

                  <h5>Edit Task</h5>

                  <input
                    className="form-control mb-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="form-control mb-2"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />

                  <input
                    type="date"
                    className="form-control mb-2"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowEdit(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={updateTask}
                    >
                      Save
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}