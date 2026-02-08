import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";

import { getSubjects } from "../../api/subjectsApi";
import "../../styles/exams.css";


export default function Subjects() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      {/* HEADER */}
      <div className="exams-header">
        <div>
          <h2 className="page-title">My Subjects</h2>
          <p className="page-subtitle">
            Subjects you are enrolled in
          </p>
        </div>
      </div>

      {/* STATES */}
      {loading && <div>Loading subjects…</div>}

      {!loading && subjects.length === 0 && (
        <div className="alert alert-info">
          No subjects found.
        </div>
      )}

      {/* GRID */}
      {!loading && subjects.length > 0 && (
        <div className="exams-grid">
          {subjects.map((subject) => (
            <div className="exam-card" key={subject.id}>
              <div className="exam-left-bar" />

              <div className="exam-content">
                <div className="exam-top">
                  <h5>
                    <FaBook className="me-2 text-primary" />
                    {subject.name}
                  </h5>
                </div>

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
