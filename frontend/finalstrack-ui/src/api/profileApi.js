import apiClient from "./apiClient";

export const getMyProfile = () =>
  apiClient.get("/api/users/me");

export const updateMyProfile = (payload) =>
  apiClient.put("/api/users/me", payload);

export const changeMyPassword = (payload) =>
  apiClient.put("/api/users/me/password", payload);
