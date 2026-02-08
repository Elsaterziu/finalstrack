import { useEffect, useState } from "react";
import { FaHeartbeat, FaPlus } from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import {
  getStressLogsByExam,
  createStressLog
} from "../../api/stressLogsApi";

import "../../styles/exams.css";

/* stress label */
const stressLabel = (level) => {
  if (level <= 3) return "Low";
  if (level <= 6) return "Medium";
  if (level <= 8) return "High";
  return "Very High";
};

/* stress logs */
export default function StressLogs() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [stressLogs, setStressLogs] = useState([]);

  const [stressLevel, setStressLevel] = useState(5);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);

      const today = new Date();
      const seasons = (await getExamSeasons()).data;

      const active = seasons.find(
        (s) =>
          new Date(s.startDate) <= today &&
          new Date(s.endDate) >= today
      );

      if (!active) return;

      const examsRes = await getExamsBySeason(active.id);
      setExams(examsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStressLogs = async (examId) => {
    const res = await getStressLogsByExam(examId);
    setStressLogs(res.data || []);
  };

  const handleAdd = async () => {
    if (!selectedExamId) return;

    await createStressLog({
      examId: selectedExamId,
      stressLevel: Number(stressLevel)
    });

    loadStressLogs(selectedExamId);
  };

  return (
    <div className="student-page">
      <h2 className="page-title">Stress Logs</h2>
      <p className="page-subtitle">
        Track how stressed you feel before exams
      </p>

      {/* EXAM SELECTOR */}
      <div className="mb-4">
        <select
          className="form-select"
          value={selectedExamId}
          onChange={(e) => {
            setSelectedExamId(e.target.value);
            loadStressLogs(e.target.value);
          }}
        >
          <option value="">Select exam</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.subjectName} — {e.examDate}
            </option>
          ))}
        </select>
      </div>

      {/* ADD STRESS LOG */}
      {selectedExamId && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">
              <FaPlus className="me-2" />
              Log Stress Level
            </h6>

            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-range"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                />
              </div>

              <div className="col-md-4 text-center">
                <div className="fs-4 fw-bold">
                  {stressLevel}/10
                </div>
                <div className="text-muted">
                  {stressLabel(stressLevel)}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary mt-3"
              onClick={handleAdd}
            >
              Add Stress Log
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {stressLogs.length === 0 && selectedExamId && (
        <div className="alert alert-info">
          No stress logs yet.
        </div>
      )}

      {stressLogs.map((log) => (
        <div className="exam-card mb-3" key={log.id}>
          <div className="exam-left-bar" />

          <div className="exam-content d-flex justify-content-between align-items-center">
            <div className="exam-meta">
              <span>
                <FaHeartbeat className="me-1 text-danger" />
                Stress level: <b>{log.stressLevel}/10</b>
              </span>
              <span className="text-muted">
                {stressLabel(log.stressLevel)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {loading && <div>Loading…</div>}
    </div>
  );
}
