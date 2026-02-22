import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSyncAlt } from "react-icons/fa";

import {
  getExamSeasons,
  createExamSeason,
  updateExamSeason,
  deleteExamSeason
} from "../../api/examSeasonsApi";

import "../professor/professor.css";

const toDate = (d) => new Date(String(d).slice(0, 10));

export default function ProfessorExamSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    Title: "",
    StartDate: "",
    EndDate: ""
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getExamSeasons();
      setSeasons(res.data || []);
    } catch (e) {
      console.error("Load exam seasons failed:", e);
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setQ("");
    await load();
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ Title: "", StartDate: "", EndDate: "" });
    setIsModalOpen(true);
  };

  const openEdit = (season) => {
    setEditing(season);
    setForm({
      Title: season.title,
      StartDate: season.startDate,
      EndDate: season.endDate
    });
    setIsModalOpen(true);
  };

  const close = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.Title || !form.StartDate || !form.EndDate) {
      alert("All fields are required.");
      return;
    }

    if (new Date(form.StartDate) > new Date(form.EndDate)) {
      alert("Start date must be before End date.");
      return;
    }

    try {
      setLoading(true);
      if (editing) await updateExamSeason(editing.id, form);
      else await createExamSeason(form);

      close();
      await load();
    } catch (e) {
      console.error("Save season failed:", e);
      alert("Failed to save exam season.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm("Delete this exam season?");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteExamSeason(id);
      await load();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete season.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = seasons
      .slice()
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (!query) return list;
    return list.filter((s) => String(s.title || "").toLowerCase().includes(query));
  }, [seasons, q]);

  const today = new Date();
  const statusFor = (s) => {
    const a = toDate(s.startDate);
    const b = toDate(s.endDate);
    if (today >= a && today <= b) return { label: "Active", cls: "active" };
    if (today < a) return { label: "Upcoming", cls: "future" };
    return { label: "Ended", cls: "ended" };
  };

  return (
    <div className="prof-page2">
      <div className="page-head">
        <div>
          <h2 className="page-title">Exam Seasons</h2>
          <div className="page-subtitle">Create and manage seasons for exams.</div>
        </div>

        <div className="page-actions">
          <button className="btn btn-outline-secondary" onClick={handleRefresh} disabled={loading}>
            <FaSyncAlt className="me-2" />
            Refresh
          </button>

          <button className="btn btn-primary" onClick={openCreate}>
            <FaPlus className="me-2" />
            New Season
          </button>
        </div>
      </div>

      <div className="prof-card2">
        <div className="prof-filters2">
          <div style={{ gridColumn: "1 / span 2" }}>
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="e.g. SHKURT/MARS 2026"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="text-muted small" style={{ paddingBottom: 6, textAlign: "right" }}>
            {loading ? "Loading..." : `${filtered.length} shown / ${seasons.length} total`}
          </div>
        </div>

        <div className="clean-list">
          <div
            className="clean-row header"
            style={{ gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.6fr auto" }}
          >
            <div>Title</div>
            <div>Start</div>
            <div>End</div>
            <div>Status</div>
            <div style={{ justifySelf: "end" }}>Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-3 text-muted">No seasons found.</div>
          ) : (
            filtered.map((s) => {
              const st = statusFor(s);
              return (
                <div
                  key={s.id}
                  className="clean-row"
                  style={{ gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.6fr auto" }}
                >
                  <div className="main">
                    <p className="name">{s.title}</p>
                    <div className="meta">ID: {s.id}</div>
                  </div>

                  <div>{s.startDate}</div>
                  <div>{s.endDate}</div>

                  <div>
                    <span className={`pill ${st.cls}`}>{st.label}</span>
                  </div>

                  <div className="actions">
                    <button className="action-icon" onClick={() => openEdit(s)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="action-icon danger" onClick={() => remove(s.id)} title="Delete">
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
        <div className="modal-backdrop-custom" onMouseDown={close}>
          <div className="modal-card" onMouseDown={(ev) => ev.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="m-0">{editing ? "Edit Exam Season" : "Create Exam Season"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={close}>
                Close
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input className="form-control" name="Title" value={form.Title} onChange={onChange} />
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" name="StartDate" value={form.StartDate} onChange={onChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" name="EndDate" value={form.EndDate} onChange={onChange} />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {editing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}