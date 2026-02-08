import { useEffect, useState } from "react";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import {
  getStudyBlocksByExam,
  createStudyBlock,
  deleteStudyBlock
} from "../../api/studyBlocksApi";

import "../../styles/exams.css";

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function StudyBlocks() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [studyBlocks, setStudyBlocks] = useState([]);

  const [studyDate, setStudyDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);

      const today = new Date();
      const seasons = (await getExamSeasons()).data;

      const active = seasons.find(
        s =>
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

  const loadStudyBlocks = async (examId) => {
    const res = await getStudyBlocksByExam(examId);
    setStudyBlocks(res.data || []);
  };

  const handleAdd = async () => {
    const minutes = Number(durationMinutes);

    // UI validation
    if (!studyDate || !selectedExamId || minutes <= 0) {
      alert("Duration must be greater than 0 minutes.");
      return;
    }

    await createStudyBlock({
      examId: selectedExamId,
      studyDate,
      durationMinutes: minutes
    });

    setStudyDate("");
    setDurationMinutes("");
    loadStudyBlocks(selectedExamId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this study session?")) return;
    await deleteStudyBlock(id);
    loadStudyBlocks(selectedExamId);
  };

  return (
    <div className="student-page">
      <h2 className="page-title">Study Blocks</h2>
      <p className="page-subtitle">Track your study time per exam</p>

      {/* EXAM SELECTOR */}
      <div className="mb-4">
        <select
          className="form-select"
          value={selectedExamId}
          onChange={(e) => {
            setSelectedExamId(e.target.value);
            loadStudyBlocks(e.target.value);
          }}
        >
          <option value="">Select exam</option>
          {exams.map(e => (
            <option key={e.id} value={e.id}>
              {e.subjectName} — {e.examDate}
            </option>
          ))}
        </select>
      </div>

      {/* ADD SESSION */}
      {selectedExamId && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">
              <i className="bi bi-plus-circle me-2" />
              Add Study Session
            </h6>

            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={studyDate}
                  onChange={(e) => setStudyDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Minutes"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAdd}
                >
                  Add Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      {studyBlocks.map(sb => (
        <div className="exam-card mb-3" key={sb.id}>
          <div className="exam-left-bar" />

          <div className="exam-content d-flex justify-content-between align-items-center">
            <div className="exam-meta">
              <span>
                <i className="bi bi-calendar-event me-1" />
                {sb.studyDate}
              </span>
              <span>
                <i className="bi bi-clock me-1" />
                {sb.durationMinutes} min ({formatDuration(sb.durationMinutes)})
              </span>
            </div>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(sb.id)}
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        </div>
      ))}

      {loading && <div>Loading…</div>}
    </div>
  );
}
