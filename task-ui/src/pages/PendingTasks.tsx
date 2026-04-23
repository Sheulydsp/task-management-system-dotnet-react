import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import type { Task } from "../types/Task";
import DataTable from "../components/DataTable";
import { getDueStatus } from "../utils/dateUtils";

export default function PendingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTasks();
  }, [location]);

  const fetchTasks = async () => {
    const res = await api.get("/Tasks");

    const pending = res.data.filter(
      (t: Task) => t.status !== "Done"
    );

    setTasks(pending);
  };

  // ✅ SMART AI SCORE (priority + due date)
  const getSmartScore = (task: Task) => {
    let score = 0;

    // Priority weight
    if (task.priority === "High") score += 3;
    else if (task.priority === "Medium") score += 2;
    else score += 1;

    // Due date urgency
    const status = getDueStatus(task.dueDate);

    if (status === "overdue") score += 5;
    if (status === "today") score += 4;
    if (status === "soon") score += 2;

    return score;
  };

  // ✅ SORT TASKS USING SMART LOGIC
  const sortedTasks = [...tasks].sort(
    (a, b) => getSmartScore(b) - getSmartScore(a)
  );

  const columns = [
    {
      header: "Title",
      accessor: (t: Task) => t.title
    },
    {
      header: "Status",
      accessor: (t: Task) => t.status
    },
    {
      header: "Priority",
      accessor: (t: Task) => (
        <span
          className={`badge ${
            t.priority === "High"
              ? "bg-danger"
              : t.priority === "Medium"
              ? "bg-warning text-dark"
              : "bg-success"
          }`}
        >
          {t.priority}
        </span>
      )
    },
    {
      header: "Assigned",
      accessor: (t: Task) => t.assigneeName || "Unassigned"
    },
    {
      header: "Due Date",
      accessor: (t: Task) => {
        const status = getDueStatus(t.dueDate);

        return (
          <div>
            {/* DATE */}
            {t.dueDate
              ? new Date(t.dueDate).toLocaleDateString()
              : "N/A"}

            {/* STATUS BADGES */}
            {status === "overdue" && (
              <span className="badge bg-danger ms-2">Overdue</span>
            )}

            {status === "today" && (
              <span className="badge bg-warning text-dark ms-2">Today</span>
            )}

            {status === "soon" && (
              <span className="badge bg-info ms-2">Soon</span>
            )}
          </div>
        );
      }
    },
    {
      header: "Actions",
      accessor: (t: Task) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/tasks/${t.id}`)}
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />

        <div className="p-4">
          <h3>
            Pending Tasks ({tasks.length})
            <span className="badge bg-primary ms-2">Smart Sorted</span>
          </h3>

          <DataTable
            data={sortedTasks}
            columns={columns}
            searchFields={["title"]}
          />
        </div>
      </div>
    </div>
  );
}