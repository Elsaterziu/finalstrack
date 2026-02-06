import apiClient from "./apiClient";

export const getSubjects = () =>
  apiClient.get("/subjects");

export const getSubjectById = (id) =>
  apiClient.get(`/subjects/${id}`);
