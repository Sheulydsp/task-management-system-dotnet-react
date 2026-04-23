import { useState, useEffect } from "react";
import api from "../api/api";
import { getCurrentUser } from "../utils/auth";
import type { Task } from "../types/Task";
import type { User } from "../types/User";



interface Props {
  task: Task;
  onStatusChange: (taskId: number, status: string) => void;
  onAssigned: () => void;
}

export default function TaskCard({ task, onStatusChange, onAssigned }: Props) {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Admin";

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState(0);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get<User[]>("/Users");
    setUsers(res.data);
    };

  const assign = async () => {
    if (!selectedUser) return;

    await api.post("/Tasks/assign", {
      taskId: task.id,
      userId: selectedUser
    });

    setSelectedUser(0);
    onAssigned(); // refresh tasks
  };

  return (
    <div className="p-3 mb-3 bg-white rounded shadow-sm">
      <strong>{task.title}</strong>

      <p>{task.description}</p>

      <small>👤 {task.assigneeName || "Unassigned"}</small>

      {/* STATUS */}
      <select
        className="form-control mt-2"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
      >
        <option value="Todo">Todo</option>
        <option value="InProgress">InProgress</option>
        <option value="Done">Done</option>
      </select>

      {/* ✅ ADMIN ASSIGN */}
      {isAdmin && (
        <div className="mt-2">
          <select
            className="form-control mb-1"
            value={selectedUser}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            <option value={0}>Assign user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button className="btn btn-warning btn-sm" onClick={assign}>
            Assign
          </button>
        </div>
      )}
    </div>
  );
}