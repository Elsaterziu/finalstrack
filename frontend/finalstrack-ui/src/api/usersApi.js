import apiClient from "./apiClient";

// ====== ME (any logged-in user) ======
export const getMe = () => apiClient.get("/users/me");
export const updateMe = (payload) => apiClient.put("/users/me", payload);
export const changeMyPassword = (payload) =>
  apiClient.put("/users/me/password", payload);

// ====== ADMIN ONLY ======
export const getUsers = () => apiClient.get("/users");
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

// ✅ status endpoint uses query param: ?active=true/false (NO body)
export const updateUserStatus = (id, active) =>
  apiClient.put(`/users/${id}/status`, null, { params: { active } });
