import apiClient from "./apiClient";

export const getExamSeasons = () =>
  apiClient.get("/exam-seasons");

export const getExamSeasonById = (id) =>
  apiClient.get(`/exam-seasons/${id}`);
