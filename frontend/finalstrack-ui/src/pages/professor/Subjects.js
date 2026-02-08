import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from "../../api/subjectsApi";

import "../student/dashboard.css";

export default function ProfessorSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      setSubjects(res.data || []);
    } catch (e) {
      console.error("Load subjects failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setName(s.name || "");
    setIsModalOpen(true);
  };

  const close = () => {
    setIsModalOpen(false);
    setEditing(null);
    setName("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Subject name is required.");
      return;
    }

    try {
      setLoading(true);
      if (editing) {
        await updateSubject(editing.id, { Name: name.trim() });
      } else {
        await createSubject({ Name: name.trim() });
      }
      close();
      await load();
    } catch (e) {
      console.error("Save subject failed:", e);
      alert("Failed to save subject.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm("Delete this subject?");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteSubject(id);
      await load();
    } catch (e) {
      console.error("Delete subject failed:", e);
      alert("Failed to delete subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="dashboard-title">Professor Subjects</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus className="me-2" />
          New Subject
        </button>
      </div>

      <div className="dashboard-card">
        {loading && <div className="text-muted mb-2">Loading...</div>}

        {subjects.length === 0 ? (
          <div className="text-muted">No subjects yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects
                  .slice()
                  .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                  .map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>
                        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => openEdit(s)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => remove(s.id)}>
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
              <h5 className="m-0">{editing ? "Edit Subject" : "Create Subject"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={close}>
                Close
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Data Structures"
                />
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
