import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DataTable from "../components/DataTable";

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  const columns = [
    {
      header: "Name",
      accessor: (p: Project) => p.name
    },
    {
      header: "Description",
      accessor: (p: Project) => p.description
    },
    {
      header: "Actions",
      accessor: (p: Project) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/projects/${p.id}`)}
        >
          View Tasks
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
          <h3>Projects ({projects.length})</h3>

          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/projects/create")}
          >
            + Create Project
          </button>

          <DataTable
            data={projects}
            columns={columns}
            searchFields={["name", "description"]}
          />
        </div>
      </div>
    </div>
  );
}