import { useState } from "react";
import api from "../api/api";

export default function CreateProjectForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = async () => {
    if (!name) {
      alert("Project name required");
      return;
    }

    await api.post("/Projects", {
      name,
      description
    });

    setName("");
    setDescription("");

    onCreated();
  };

  return (
    <div className="card p-3 shadow-sm">
      

      <input
        className="form-control mb-2"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="btn btn-primary" onClick={createProject}>
        Create Project
      </button>
    </div>
  );
}