import apiClient from "./apiClient";

export const getSubjects = () =>
  apiClient.get("/api/subjects");

export const getSubjectById = (id) =>
  apiClient.get(`/api/subjects/${id}`);
