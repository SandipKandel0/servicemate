import axiosClient from "./axiosClient";

export const fetchVehicles = () => axiosClient.get("/vehicles");
export const fetchVehicle = (id) => axiosClient.get(`/vehicles/${id}`);
export const createVehicle = (payload) => axiosClient.post("/vehicles", payload);
export const updateVehicle = (id, payload) => axiosClient.put(`/vehicles/${id}`, payload);
export const deleteVehicle = (id) => axiosClient.delete(`/vehicles/${id}`);
