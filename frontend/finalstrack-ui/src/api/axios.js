import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7092/api",
});

export default api;
