import apiClient from "./apiClient";

export const getExamSeasons = () =>
  apiClient.get("/api/exam-seasons");

export const getExamSeasonById = (id) =>
  apiClient.get(`/api/exam-seasons/${id}`);
