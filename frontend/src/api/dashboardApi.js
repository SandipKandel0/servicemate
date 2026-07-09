import axiosClient from "./axiosClient";

export const fetchDashboard = () => axiosClient.get("/dashboard");
