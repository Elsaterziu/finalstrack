import { useEffect, useMemo, useState } from "react";
import { getExamSeasons } from "../../api/examSeasonsApi";
import "../student/dashboard.css";

export default function ProfessorExamSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

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

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = seasons.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    if (!query) return list;
    return list.filter((s) => String(s.title || "").toLowerCase().includes(query));
  }, [seasons, q]);

  return (
    <div className="dashboard-page">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="dashboard-title">Exam Seasons</h2>
          <div className="dashboard-subtitle">View seasons (created by students)</div>
        </div>

        <div style={{ minWidth: 280 }}>
          <label className="form-label">Search</label>
          <input
            className="form-control"
            placeholder="e.g. January 2026"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
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
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.title}</td>
                    <td>{s.startDate}</td>
                    <td>{s.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="chart-footer mt-2">
          Professors can manage exams inside a season from the “Exams” page.
        </div>
      </div>
    </div>
  );
}
