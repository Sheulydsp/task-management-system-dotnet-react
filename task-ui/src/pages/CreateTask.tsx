import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateTaskForm from "../pages/CreateTaskForm";

export default function CreateTask() {
    const navigate = useNavigate();
    
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        <Topbar />

        <div className="p-4">
          <CreateTaskForm onCreated={() => navigate("/tasks/pending")} />
        </div>
      </div>
    </div>
  );
}