import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import {
  getExamSeasons,
  createExamSeason,
  updateExamSeason,
  deleteExamSeason
} from "../../api/examSeasonsApi";

import "../student/dashboard.css";

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

    try {
      setLoading(true);

      if (editing) {
        await updateExamSeason(editing.id, form);
      } else {
        await createExamSeason(form);
      }

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

    return list.filter((s) =>
      String(s.title || "").toLowerCase().includes(query)
    );
  }, [seasons, q]);

  return (
    <div className="dashboard-page">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="dashboard-title">Exam Seasons</h2>

        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus className="me-2" />
          New Season
        </button>
      </div>

      <div className="dashboard-card mb-3">
        <label className="form-label">Search</label>
        <input
          className="form-control"
          placeholder="e.g. January 2026"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="dashboard-card">
        {loading && <div className="text-muted mb-2">Loading...</div>}

        {filtered.length === 0 ? (
          <div className="text-muted">No seasons found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start</th>
                  <th>End</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.title}</td>
                    <td>{s.startDate}</td>
                    <td>{s.endDate}</td>
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => openEdit(s)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => remove(s.id)}
                      >
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
              <h5 className="m-0">
                {editing ? "Edit Exam Season" : "Create Exam Season"}
              </h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={close}>
                Close
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  name="Title"
                  value={form.Title}
                  onChange={onChange}
                />
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="StartDate"
                    value={form.StartDate}
                    onChange={onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="EndDate"
                    value={form.EndDate}
                    onChange={onChange}
                  />
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
