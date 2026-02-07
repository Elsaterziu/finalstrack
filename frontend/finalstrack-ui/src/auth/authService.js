import api from "../api/apiClient";
import { tokenStorage } from "./tokenStorage";

export const authService = {
  async login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    tokenStorage.setTokens({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });
    return res.data;
  },

  async register(fullName, email, password) {
    // backend-i yt kthen string "User registered successfully"
    const res = await api.post("/api/auth/register", { fullName, email, password });
    return res.data;
  },

  async me() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  async logout() {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) {
        await api.post("/api/auth/revoke", { refreshToken });
      }
    } finally {
      tokenStorage.clear();
    }
  },
};
