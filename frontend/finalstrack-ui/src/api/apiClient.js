import axios from "axios";
import { tokenStorage } from "../auth/tokenStorage";

const api = axios.create({
  baseURL: "https://localhost:7092",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function resolveQueue(error, token = null) {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const refresh = tokenStorage.getRefresh();

    const isAuthEndpoint =
      original.url?.includes("/api/auth/login") ||
      original.url?.includes("/api/auth/register") ||
      original.url?.includes("/api/auth/refresh");

    if (status === 401 && !original._retry && refresh && !isAuthEndpoint) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const resp = await api.post("/api/auth/refresh", { refreshToken: refresh });
        const newAccess = resp.data?.accessToken;
        const newRefresh = resp.data?.refreshToken || refresh;

          tokenStorage.setTokens({ accessToken: newAccess, refreshToken: newRefresh });

        resolveQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (err) {
        resolveQueue(err, null);
        tokenStorage.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
