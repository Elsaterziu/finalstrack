import apiClient from "./apiClient";

export const getStudyBlocksByExam = (examId) =>
  apiClient.get(`/study-blocks/exam/${examId}`);

export const createStudyBlock = (data) =>
  apiClient.post("/study-blocks", data);

export const deleteStudyBlock = (id) =>
  apiClient.delete(`/study-blocks/${id}`);
