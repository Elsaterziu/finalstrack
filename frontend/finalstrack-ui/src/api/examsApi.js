import apiClient from "./apiClient";

export const getExamsBySeason = (examSeasonId) =>
  apiClient.get(`/api/exams/season/${examSeasonId}`);

export const getExamById = (id) =>
  apiClient.get(`/api/exams/${id}`);
