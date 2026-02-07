import api from "../api/apiClient";

export const adminService = {
  // USERS
  async getAllUsers() {
    const res = await api.get("/api/users");
    return res.data; // UserResponseDto[]
  },

  async setUserStatus(userId, active) {
    const res = await api.put(`/api/users/${userId}/status`, null, {
      params: { active }, // query ?active=true/false
    });
    return res.data;
  },

  async deleteUser(userId) {
    const res = await api.delete(`/api/users/${userId}`);
    return res.data;
  },

  // ROLES
  async getUserRoles(userId) {
    const res = await api.get(`/api/roles/user/${userId}`);
    return res.data; // string[]
  },

  async assignRole(userId, roleName) {
    const res = await api.post("/api/roles/assign", { userId, roleName });
    return res.data;
  },

  async removeRole(userId, roleName) {
    const res = await api.post("/api/roles/remove", { userId, roleName });
    return res.data;
  },

  // PROFILE (top-right)
  async getMe() {
    const res = await api.get("/api/users/me");
    return res.data; // UserResponseDto
  },

  async updateMe(fullName) {
    const res = await api.put("/api/users/me", { fullName });
    return res.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.put("/api/users/me/password", { currentPassword, newPassword });
    return res.data;
  },
};
