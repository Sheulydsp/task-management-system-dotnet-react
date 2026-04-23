import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../utils/auth";
import api from "../api/api";

export default function Profile() {
  const user = getCurrentUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await api.get("/Users/me");

    setName(res.data.name);
    setEmail(res.data.email);
    setImage(res.data.profileImageUrl || ""); // ✅ load image
  };

  const saveProfile = async () => {
    try {
      await api.put("/Users/profile", {
        name,
        email
      });

      alert("Profile updated successfully");

    } catch (err: any) {
      alert(err.response?.data || "Update failed");
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/Users/upload", formData);

    return res.data;
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />

        <div className="p-4">
          <h3>My Profile</h3>

          <div className="card p-4 mt-3" style={{ maxWidth: "500px" }}>

            {/* ✅ Avatar */}
            <div className="text-center mb-3">
              {image ? (
                <img
                  src={`http://localhost:5152${image}`}
                  alt="profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#1e293b",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "auto"
                  }}
                >
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="mb-3">
              <label>Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label>Role</label>
              <input
                className="form-control"
                value={user?.role}
                disabled
              />
            </div>

            {/* ✅ Upload Image */}
            <input
              type="file"
              className="form-control mb-3"
              onChange={async (e) => {
                if (!e.target.files) return;

                const url = await uploadImage(e.target.files[0]);

                setImage(url);

                // ✅ FIXED: send JSON
                await api.put("/Users/profile-image", {
                  imageUrl: url
                });
              }}
            />

            {/* Save */}
            <button className="btn btn-primary w-100" onClick={saveProfile}>
              Save Changes
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}