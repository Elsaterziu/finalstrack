import api from "../api/apiClient";

export const adminService = {
  // USERS
  async getAllUsers() {
    const res = await api.get("/api/users");
    return res.data;
  },

  async setUserStatus(userId, active) {
    const res = await api.put(`/api/users/${userId}/status`, null, {
      params: { active },
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
    return res.data; 
  },

  async assignRole(userId, roleName) {
    const res = await api.post("/api/roles/assign", { userId, roleName });
    return res.data;
  },

  async removeRole(userId, roleName) {
    const res = await api.post("/api/roles/remove", { userId, roleName });
    return res.data;
  },

  // SETTINGS (MY ACCOUNT)
  async getAuthMe() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  async updateMe(payload) {
    const res = await api.put("/api/users/me", payload);
    return res.data;
  },

  async changeMyPassword(payload) {
    const res = await api.put("/api/users/me/password", payload);
    return res.data;
  },
};
