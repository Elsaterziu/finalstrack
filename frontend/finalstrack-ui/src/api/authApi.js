import apiClient from "./apiClient";

export const login = (email, password) =>
  apiClient.post("/auth/login", { email, password });

export const register = (fullName, email, password) =>
  apiClient.post("/auth/register", { fullName, email, password });

export const refresh = (refreshToken) =>
  apiClient.post("/auth/refresh", { refreshToken });

export const revoke = (refreshToken) =>
  apiClient.post("/auth/revoke", { refreshToken });
