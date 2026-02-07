import apiClient from "./apiClient";

export const getStressLogsByExam = (examId) =>
  apiClient.get(`/api/stress-logs/exam/${examId}`);

export const createStressLog = (data) =>
  apiClient.post("/api/stress-logs", data);
