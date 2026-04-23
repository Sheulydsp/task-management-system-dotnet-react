import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import CreateTask from "./pages/CreateTask";
import { getCurrentUser } from "./utils/auth";
import PendingTasks from "./pages/PendingTasks";
import CompletedTasks from "./pages/CompletedTasks";
import ProjectTasks from "./pages/ProjectTasks";
import CreateProject from "./pages/CreateProject";
import TaskDetails from "./pages/TaskDetails"
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();
  const role = user?.role;

  return (
    <Routes>

      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/tasks/pending"
        element={token ? <PendingTasks /> : <Navigate to="/login" />}
      />

      <Route
        path="/tasks/completed"
        element={token ? <CompletedTasks /> : <Navigate to="/login" />}
      />

      {/* ✅ ADMIN ONLY ROUTES */}
      <Route
        path="/projects"
        element={
          token && role === "Admin"
            ? <Projects />
            : <Navigate to="/dashboard" />
        }
      />

      <Route
  path="/projects/:id"
  element={token ? <ProjectTasks /> : <Navigate to="/login" />}
/>

      <Route
        path="/tasks/create"
        element={
          token && role === "Admin"
            ? <CreateTask />
            : <Navigate to="/dashboard" />
        }
      />

      <Route
        path="/tasks/:id"
        element={user ? <TaskDetails /> : <Navigate to="/login" />}
      />

      <Route
        path="/projects/create"
        element={token && role === "Admin"
          ? <CreateProject />
          : <Navigate to="/dashboard" />
        }
      />

      <Route
  path="/profile"
  element={token ? <Profile /> : <Navigate to="/login" />}
/>

<Route path="/register" element={<Register />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

    </Routes>

    
  );
}

export default App;