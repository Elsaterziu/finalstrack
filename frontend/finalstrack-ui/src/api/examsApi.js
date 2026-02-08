import apiClient from "./apiClient";

export const getExamsBySeason = (examSeasonId) =>
  apiClient.get(`/api/exams/season/${examSeasonId}`);

export const getExamById = (id) =>
  apiClient.get(`/api/exams/${id}`);

// Professor-only
export const createExam = (payload) =>
  apiClient.post("/api/exams", payload);

export const updateExam = (id, payload) =>
  apiClient.put(`/api/exams/${id}`, payload);

export const deleteExam = (id) =>
  apiClient.delete(`/api/exams/${id}`);
