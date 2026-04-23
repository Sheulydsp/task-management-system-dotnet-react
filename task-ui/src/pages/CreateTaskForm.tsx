import { useEffect, useState } from "react";
import api from "../api/api";

export default function CreateTaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [dueDate, setDueDate] = useState("");

  const priorities = [
    { label: "Low", value: 0 },
    { label: "Medium", value: 1 },
    { label: "High", value: 2 }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  const createTask = async () => {
    if (!selectedProject) {
      alert("Select project");
      return;
    }

    await api.post("/Tasks", {
      title,
      description,
      projectId: selectedProject,
      priority,
      dueDate: dueDate || null
    });

    setTitle("");
    setDescription("");
    setSelectedProject(0);

    onCreated(); // refresh dashboard
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Create Task</h5>

      <input
        className="form-control mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="form-control mb-2"
        value={selectedProject}
        onChange={(e) => setSelectedProject(Number(e.target.value))}
      >
        <option value={0}>Select Project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="form-control mb-2"
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
      >
        {priorities.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="form-control mb-2"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        />

      <button className="btn btn-dark" onClick={createTask}>
        Create Task
      </button>
    </div>
  );
}