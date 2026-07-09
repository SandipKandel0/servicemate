import axiosClient from "./axiosClient";

export const registerUser = (payload) => axiosClient.post("/auth/register", payload);
export const loginUser = (payload) => axiosClient.post("/auth/login", payload);
export const logoutUser = (refreshToken) => axiosClient.post("/auth/logout", { refreshToken });
export const forgotPassword = (email) => axiosClient.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  axiosClient.post(`/auth/reset-password/${token}`, { password });
export const getCurrentUser = () => axiosClient.get("/auth/me");
export const updateProfile = (payload) => axiosClient.put("/auth/me", payload);
export const updateNotificationSettings = (payload) =>
  axiosClient.put("/auth/notification-settings", payload);
