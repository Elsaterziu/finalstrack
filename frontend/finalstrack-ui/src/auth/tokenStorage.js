export const tokenStorage = {
  getAccess() {
    return localStorage.getItem("accessToken");
  },
  getRefresh() {
    return localStorage.getItem("refreshToken");
  },

setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  else localStorage.removeItem("accessToken");

  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  else localStorage.removeItem("refreshToken");
},

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
