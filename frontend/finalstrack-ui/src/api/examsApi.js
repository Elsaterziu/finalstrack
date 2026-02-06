import apiClient from "./apiClient";

export const getExamsBySeason = (examSeasonId) =>
  apiClient.get(`/exams/season/${examSeasonId}`);

export const getExamById = (id) =>
  apiClient.get(`/exams/${id}`);
