import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSyncAlt } from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getSubjects } from "../../api/subjectsApi";
import {
  getExamsBySeason,
  createExam,
  updateExam,
  deleteExam
} from "../../api/examsApi";

import "../professor/professor.css";

const normalizeTime = (t) => {
  if (!t) return "";
  const s = String(t).trim();
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(s)) return s.length === 5 ? `${s}:00` : s;
  return s;
};

const toDateTime = (examDate, examTime) =>
  new Date(`${examDate}T${String(examTime || "00:00:00").slice(0, 8)}`);

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
  const [query, setQuery] = useState("");

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

  const bootstrap = useCallback(async () => {
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

      const today = new Date();
      const active = seasonsData.find(
        (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
      );

      const initialSeasonId = active?.id || seasonsData[0]?.id || "";
      setSelectedSeasonId(initialSeasonId ? String(initialSeasonId) : "");

      if (initialSeasonId) await loadExamsBySeason(initialSeasonId);
    } catch (e) {
      console.error("ProfessorExams bootstrap failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const handleRefresh = async () => {
    setQuery("");
    await bootstrap();
  };

  const seasonTitle = useMemo(() => {
    const s = seasons.find((x) => String(x.id) === String(selectedSeasonId));
    return s?.title || "—";
  }, [seasons, selectedSeasonId]);

  const onSeasonChange = async (e) => {
    const id = e.target.value;
    setSelectedSeasonId(id);
    setQuery("");
    if (id) await loadExamsBySeason(id);
    else setExams([]);
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
      ExamDate: exam.examDate,
      ExamTime: exam.examTime ? String(exam.examTime).slice(0, 5) : ""
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
      alert("Failed to save exam.");
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = exams
      .slice()
      .sort((a, b) => toDateTime(a.examDate, a.examTime) - toDateTime(b.examDate, b.examTime));

    if (!q) return sorted;

    return sorted.filter((e) => {
      const subject = String(e.subjectName || "").toLowerCase();
      const date = String(e.examDate || "").toLowerCase();
      return subject.includes(q) || date.includes(q);
    });
  }, [exams, query]);

  const now = new Date();

  return (
    <div className="prof-page2">
      <div className="page-head">
        <div>
          <h2 className="page-title">Exams</h2>
          <div className="page-subtitle">
            Season: <b>{seasonTitle}</b>
          </div>
        </div>

        <div className="page-actions">
          <button className="btn btn-outline-secondary" onClick={handleRefresh} disabled={loading}>
            <FaSyncAlt className="me-2" />
            Refresh
          </button>

          <button className="btn btn-primary" onClick={openCreate} disabled={!selectedSeasonId}>
            <FaPlus className="me-2" />
            New Exam
          </button>
        </div>
      </div>

      <div className="prof-card2">
        <div className="prof-filters2">
          <div>
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

          <div>
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Search by subject or date..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="text-muted small" style={{ paddingBottom: 6, textAlign: "right" }}>
            {loading ? "Loading..." : `${filtered.length} shown / ${exams.length} total`}
          </div>
        </div>

        <div className="clean-list">
          <div
            className="clean-row header"
            style={{ gridTemplateColumns: "1.6fr 0.8fr 0.55fr 0.6fr auto" }}
          >
            <div>Subject</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
            <div style={{ justifySelf: "end" }}>Actions</div>
          </div>

          {!selectedSeasonId ? (
            <div className="p-3 text-muted">Select a season to view exams.</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-muted">No exams in this season.</div>
          ) : (
            filtered.map((e) => {
              const dt = toDateTime(e.examDate, e.examTime);
              const isUpcoming = dt > now;

              return (
                <div
                  key={e.id}
                  className="clean-row"
                  style={{ gridTemplateColumns: "1.6fr 0.8fr 0.55fr 0.6fr auto" }}
                >
                  <div className="main">
                    <p className="name">{e.subjectName}</p>
                    <div className="meta">ID: {e.id}</div>
                  </div>

                  <div>{e.examDate}</div>
                  <div>{String(e.examTime).slice(0, 5)}</div>

                  <div>
                    <span className={`pill ${isUpcoming ? "upcoming" : "past"}`}>
                      {isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="actions">
                    <button className="action-icon" onClick={() => openEdit(e)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="action-icon danger" onClick={() => remove(e.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onMouseDown={closeModal}>
          <div className="modal-card" onMouseDown={(ev) => ev.stopPropagation()}>
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
                <select className="form-select" name="SubjectId" value={form.SubjectId} onChange={onChange}>
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
                  <input type="date" className="form-control" name="ExamDate" value={form.ExamDate} onChange={onChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Exam Time</label>
                  <input type="time" className="form-control" name="ExamTime" value={form.ExamTime} onChange={onChange} />
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