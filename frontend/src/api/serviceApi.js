import axiosClient from "./axiosClient";

export const fetchServices = (params) => axiosClient.get("/services", { params });
export const fetchService = (id) => axiosClient.get(`/services/${id}`);
export const createService = (payload) => axiosClient.post("/services", payload);
export const updateService = (id, payload) => axiosClient.put(`/services/${id}`, payload);
export const deleteService = (id) => axiosClient.delete(`/services/${id}`);
