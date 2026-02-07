import apiClient from "./apiClient";

export const getStudyBlocksByExam = (examId) =>
  apiClient.get(`/api/study-blocks/exam/${examId}`);

export const createStudyBlock = (data) =>
  apiClient.post("/api/study-blocks", data);

export const deleteStudyBlock = (id) =>
  apiClient.delete(`/api/study-blocks/${id}`);
