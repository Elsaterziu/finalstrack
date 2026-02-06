import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7092/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
