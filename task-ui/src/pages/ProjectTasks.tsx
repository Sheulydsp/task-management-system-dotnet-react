import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import type { Task } from "../types/Task";
import DataTable from "../components/DataTable";

export default function ProjectTasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
  const res = await api.get(`/Tasks/project/${id}`);

  setTasks(res.data.tasks);           // ✅ correct
  setProjectName(res.data.projectName); // ✅ correct
};


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
    accessor: (t: Task) =>
    <span
      className={`badge ${
        t.priority === "High"
          ? "bg-danger"
          : t.priority === "Medium"
          ? "bg-warning"
          : "bg-success"
      }`}
    >
      {t.priority}
    </span>
        

  },
  {
    header: "Assigned",
    accessor: (t: Task) => t.assigneeName || "Unassigned"
  },
  {
    header: "Due Date",
    accessor: (t: Task) =>
      t.dueDate
        ? new Date(t.dueDate).toLocaleDateString()
        : "N/A"
  }
];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />

        <div className="p-4">
          <h3>Project Tasks</h3>

          <DataTable
            data={tasks}
            columns={columns}
            searchFields={["title"]}
          />
        </div>
      </div>
    </div>
  );
}