import apiClient from "./apiClient";

export const getSubjects = () =>
  apiClient.get("/api/subjects");

export const getSubjectById = (id) =>
  apiClient.get(`/api/subjects/${id}`);

// Professor-only
export const createSubject = (payload) =>
  apiClient.post("/api/subjects", payload);

export const updateSubject = (id, payload) =>
  apiClient.put(`/api/subjects/${id}`, payload);

export const deleteSubject = (id) =>
  apiClient.delete(`/api/subjects/${id}`);
