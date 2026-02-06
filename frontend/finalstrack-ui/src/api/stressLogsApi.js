import apiClient from "./apiClient";

export const getStressLogsByExam = (examId) =>
  apiClient.get(`/stress-logs/exam/${examId}`);

export const createStressLog = (data) =>
  apiClient.post("/stress-logs", data);
