import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getSubjects } from "../../api/subjectsApi";
import {
  getExamsBySeason,
  createExam,
  updateExam,
  deleteExam
} from "../../api/examsApi";

import "../student/dashboard.css"; 

const normalizeTime = (t) => {
  if (!t) return "";

  const s = String(t).trim();

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(s)) {
    return s.length === 5 ? `${s}:00` : s;
  }

  const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const ap = m[3].toUpperCase();

    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;

    return `${String(hh).padStart(2, "0")}:${mm}:00`;
  }

  return s;
};

export default function ProfessorExams() {
  const [seasons, setSeasons] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [exams, setExams] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [form, setForm] = useState({
    ExamSeasonId: "",
    SubjectId: "",
    ExamDate: "",
    ExamTime: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      setLoading(true);
      const [seasonsRes, subjectsRes] = await Promise.all([
        getExamSeasons(),
        getSubjects()
      ]);

      const seasonsData = seasonsRes.data || [];
      const subjectsData = subjectsRes.data || [];

      setSeasons(seasonsData);
      setSubjects(subjectsData);

      // default: active season or first
      const today = new Date();
      const active = seasonsData.find(
        (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
      );

      const initialSeasonId = active?.id || seasonsData[0]?.id || "";
      setSelectedSeasonId(initialSeasonId ? String(initialSeasonId) : "");

      if (initialSeasonId) {
        await loadExamsBySeason(initialSeasonId);
      }
    } catch (e) {
      console.error("ProfessorExams bootstrap failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadExamsBySeason = async (seasonId) => {
    try {
      setLoading(true);
      const res = await getExamsBySeason(seasonId);
      setExams(res.data || []);
    } catch (e) {
      console.error("Load exams failed:", e);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingExam(null);
    setForm({
      ExamSeasonId: selectedSeasonId || "",
      SubjectId: "",
      ExamDate: "",
      ExamTime: ""
    });
    setIsModalOpen(true);
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setForm({
      ExamSeasonId: String(exam.examSeasonId),
      SubjectId: String(exam.subjectId),
      ExamDate: exam.examDate, // "YYYY-MM-DD"
      ExamTime: exam.examTime ? String(exam.examTime).slice(0, 5) : "" // show "HH:mm"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSeasonChange = async (e) => {
    const id = e.target.value;
    setSelectedSeasonId(id);
    if (id) await loadExamsBySeason(id);
    else setExams([]);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.ExamSeasonId || !form.SubjectId || !form.ExamDate || !form.ExamTime) {
      alert("Please fill Exam Season, Subject, Date and Time.");
      return;
    }

    try {
      setLoading(true);

      if (editingExam) {
        await updateExam(editingExam.id, {
          ExamDate: form.ExamDate,
          ExamTime: normalizeTime(form.ExamTime),
          SubjectId: Number(form.SubjectId)
        });
      } else {
        await createExam({
          ExamSeasonId: Number(form.ExamSeasonId),
          SubjectId: Number(form.SubjectId),
          ExamDate: form.ExamDate,
          ExamTime: normalizeTime(form.ExamTime)
        });
      }

      closeModal();
      if (selectedSeasonId) await loadExamsBySeason(selectedSeasonId);
    } catch (e) {
      console.error("Save exam failed:", e);

      const apiMsg =
        e?.response?.data?.title ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null);

      alert(apiMsg ? `Failed to save exam: ${apiMsg}` : "Failed to save exam. Check console / API response.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm("Delete this exam?");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteExam(id);
      if (selectedSeasonId) await loadExamsBySeason(selectedSeasonId);
    } catch (e) {
      console.error("Delete exam failed:", e);
      alert("Failed to delete exam.");
    } finally {
      setLoading(false);
    }
  };

  const seasonTitle = useMemo(() => {
    const s = seasons.find((x) => String(x.id) === String(selectedSeasonId));
    return s?.title || "—";
  }, [seasons, selectedSeasonId]);

  return (
    <div className="dashboard-page">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="dashboard-title">Professor Exams</h2>
          <div className="dashboard-subtitle">
            Season: <b>{seasonTitle}</b>
          </div>
        </div>

        <button className="btn btn-primary" onClick={openCreate} disabled={!selectedSeasonId}>
          <FaPlus className="me-2" />
          New Exam
        </button>
      </div>

      <div className="dashboard-card mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Exam Season</label>
            <select className="form-select" value={selectedSeasonId} onChange={onSeasonChange}>
              <option value="">Select season...</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.startDate} → {s.endDate})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 text-md-end">
            <div className="text-muted small">
              {loading ? "Loading..." : `${exams.length} exams`}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        {selectedSeasonId === "" ? (
          <div className="text-muted">Select a season to view exams.</div>
        ) : exams.length === 0 ? (
          <div className="text-muted">No exams in this season yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(`${a.examDate}T${String(a.examTime).slice(0, 8)}`) -
                      new Date(`${b.examDate}T${String(b.examTime).slice(0, 8)}`)
                  )
                  .map((e) => (
                    <tr key={e.id}>
                      <td>{e.subjectName}</td>
                      <td>{e.examDate}</td>
                      <td>{String(e.examTime).slice(0, 5)}</td>
                      <td>
                        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => openEdit(e)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => remove(e.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="m-0">{editingExam ? "Edit Exam" : "Create Exam"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={closeModal}>
                Close
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Exam Season</label>
                <select
                  className="form-select"
                  name="ExamSeasonId"
                  value={form.ExamSeasonId}
                  onChange={onChange}
                  disabled={!!editingExam}
                >
                  <option value="">Select season...</option>
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  name="SubjectId"
                  value={form.SubjectId}
                  onChange={onChange}
                >
                  <option value="">Select subject...</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Exam Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="ExamDate"
                    value={form.ExamDate}
                    onChange={onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Exam Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="ExamTime"
                    value={form.ExamTime}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {editingExam ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
