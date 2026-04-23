import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Column from "../components/Column";
import type { Task } from "../types/Task";
import type { TaskActivity } from "../types/TaskActivity";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
    fetchActivity();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/Tasks");
    setTasks(res.data);
  };

  const fetchActivity = async () => {
    const res = await api.get("/Tasks/1/activity"); 
    // 🔥 later replace with global activity endpoint if needed
    setActivities(res.data.slice(0, 5)); // latest 5 only
  };

  const fetchStats = async () => {
    const res = await api.get("/Tasks/dashboard");
    setStats(res.data);
  };

  const changeStatus = async (taskId: number, status: string) => {
    const task = tasks.find((t) => t.id === taskId);

    await api.patch("/Tasks/status", {
      taskId,
      newStatus: status === "Todo" ? 0 : status === "InProgress" ? 1 : 2,
      rowVersion: task?.rowVersion
    });

    fetchTasks();
    fetchStats();
  };

  const refreshTasks = () => {
    fetchTasks();
    fetchStats();
  };

  const getIcon = (action: string) => {
    const text = action.toLowerCase();

    if (text.includes("created")) return "🟢";
    if (text.includes("updated")) return "🔵";
    if (text.includes("assigned")) return "🟡";
    if (text.includes("status")) return "🟣";

    return "📝";
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        <Topbar />

        <div className="p-4 bg-light" style={{ flex: 1 }}>

          {/* 🔥 ANALYTICS */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card p-3 shadow-sm">
                  <h6>Total Tasks</h6>
                  <h4>{stats.total}</h4>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 shadow-sm">
                  <h6>Completed</h6>
                  <h4>{stats.completed}</h4>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 shadow-sm">
                  <h6>Overdue</h6>
                  <h4 className="text-danger">{stats.overdue}</h4>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 shadow-sm">
                  <h6>Completion Rate</h6>
                  <h4>{stats.completionRate}%</h4>
                </div>
              </div>
            </div>
          )}

          {/* 🔥 MAIN LAYOUT */}
          <div className="row">

            {/* 🟦 LEFT: KANBAN */}
            <div className="col-md-8">
              <div className="d-flex gap-3">

                <Column
                  title="Todo"
                  tasks={tasks.filter(t => t.status === "Todo")}
                  onStatusChange={changeStatus}
                  onAssigned={refreshTasks}
                />

                <Column
                  title="InProgress"
                  tasks={tasks.filter(t => t.status === "InProgress")}
                  onStatusChange={changeStatus}
                  onAssigned={refreshTasks}
                />

                <Column
                  title="Done"
                  tasks={tasks.filter(t => t.status === "Done")}
                  onStatusChange={changeStatus}
                  onAssigned={refreshTasks}
                />

              </div>
            </div>

            {/* 🟩 RIGHT: ACTIVITY */}
            <div className="col-md-4">

              <div className="card p-3 shadow-sm">
                <h6>Recent Activity</h6>

                {activities.length === 0 ? (
                  <p className="text-muted">No activity yet</p>
                ) : (
                  activities.map((a) => (
                    <div
                      key={a.id}
                      className="d-flex align-items-start gap-2 py-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <div>{getIcon(a.action)}</div>

                      <div>
                        <div style={{ fontSize: "14px" }}>
                          {a.action}
                        </div>
                        <small className="text-muted">
                          {new Date(a.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))
                )}

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}