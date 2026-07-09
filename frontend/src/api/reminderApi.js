import axiosClient from "./axiosClient";

export const fetchReminders = (params) => axiosClient.get("/reminders", { params });
export const createReminder = (payload) => axiosClient.post("/reminders", payload);
export const updateReminder = (id, payload) => axiosClient.put(`/reminders/${id}`, payload);
export const deleteReminder = (id) => axiosClient.delete(`/reminders/${id}`);
