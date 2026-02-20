import apiClient from "./apiClient";

export const getExamSeasons = () =>
  apiClient.get("/api/exam-seasons");

export const getExamSeasonById = (id) =>
  apiClient.get(`/api/exam-seasons/${id}`);

export const createExamSeason = (payload) =>
  apiClient.post("/api/exam-seasons", payload);

export const updateExamSeason = (id, payload) =>
  apiClient.put(`/api/exam-seasons/${id}`, payload);

export const deleteExamSeason = (id) =>
  apiClient.delete(`/api/exam-seasons/${id}`);
