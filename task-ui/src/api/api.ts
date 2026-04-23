import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5152/api"
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔐 RESPONSE INTERCEPTOR
let isRedirecting = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (!isRedirecting && window.location.pathname !== "/login") {
        isRedirecting = true;

        localStorage.setItem("sessionExpired", "true");
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    }

    if (!err.response) {
      console.error("Network error or server unavailable");
    }

    return Promise.reject(err);
  }
);

export default api;