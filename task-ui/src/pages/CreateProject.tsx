import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateProjectForm from "../pages/CreateProjectForm";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />

        <div className="p-4">
          <h3>Create Project</h3>

          <CreateProjectForm
            onCreated={() => navigate("/projects")}
          />
        </div>
      </div>
    </div>
  );
} 