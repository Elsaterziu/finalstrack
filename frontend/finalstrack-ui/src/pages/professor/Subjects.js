import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSyncAlt } from "react-icons/fa";

import { getSubjects, createSubject, updateSubject, deleteSubject } from "../../api/subjectsApi";
import "../professor/professor.css";

export default function ProfessorSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      setSubjects(res.data || []);
    } catch (e) {
      console.error("Load subjects failed:", e);
      setSubjects([]);
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
    if (!name.trim()) return alert("Subject name is required.");

    try {
      setLoading(true);
      if (editing) await updateSubject(editing.id, { Name: name.trim() });
      else await createSubject({ Name: name.trim() });
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
    if (!window.confirm("Delete this subject?")) return;
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

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = subjects.slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (!query) return list;
    return list.filter((s) => String(s.name || "").toLowerCase().includes(query));
  }, [subjects, q]);

  return (
    <div className="prof-page2">
      <div className="page-head">
        <div>
          <h2 className="page-title">Subjects</h2>
          <div className="page-subtitle">Create and manage subjects for your exams.</div>
        </div>

        <div className="page-actions">
          <button className="btn btn-outline-secondary" onClick={handleRefresh} disabled={loading}>
            <FaSyncAlt className="me-2" /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <FaPlus className="me-2" /> New Subject
          </button>
        </div>
      </div>

      <div className="prof-card2">
        <div className="prof-filters2" style={{ gridTemplateColumns: "1fr auto" }}>
          <div>
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Search by name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="text-muted small" style={{ paddingBottom: 6, textAlign: "right" }}>
            {loading ? "Loading..." : `${filtered.length} shown / ${subjects.length} total`}
          </div>
        </div>

        <div className="clean-list">
          <div className="clean-row header" style={{ gridTemplateColumns: "1.6fr 0.6fr auto" }}>
            <div>Name</div>
            <div>ID</div>
            <div style={{ justifySelf: "end" }}>Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-3 text-muted">No subjects found.</div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="clean-row" style={{ gridTemplateColumns: "1.6fr 0.6fr auto" }}>
                <div className="main">
                  <p className="name">{s.name}</p>
                </div>

                <div>{s.id}</div>

                <div className="actions">
                  <button className="action-icon" onClick={() => openEdit(s)} title="Edit">
                    <FaEdit />
                  </button>
                  <button className="action-icon danger" onClick={() => remove(s.id)} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onMouseDown={close}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="m-0">{editing ? "Edit Subject" : "Create Subject"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={close}>Close</button>
            </div>

            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
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