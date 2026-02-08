import { useEffect, useState } from "react";
import { FaBookOpen, FaCalendarAlt, FaClock } from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";

import "../../styles/exams.css";

export default function Exams() {
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(null);
  const [exams, setExams] = useState([]);

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

      if (!active) {
        setActiveSeason(null);
        setExams([]);
        return;
      }

      setActiveSeason(active);

      const examsRes = await getExamsBySeason(active.id);
      setExams(examsRes.data || []);
    } catch (err) {
      console.error("Failed to load exams:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      {/* HEADER */}
      <div className="exams-header">
        <div>
          <h2 className="page-title">My Exams</h2>
          {activeSeason && (
            <p className="page-subtitle">
              Active season: <b>{activeSeason.title}</b>
            </p>
          )}
        </div>
      </div>

      {/* STATES */}
      {!activeSeason && !loading && (
        <div className="alert alert-warning">
          No active exam season.
        </div>
      )}

      {loading && <div>Loading exams…</div>}

      {!loading && exams.length === 0 && activeSeason && (
        <div className="alert alert-info">
          No exams scheduled yet.
        </div>
      )}

      {/* GRID */}
      {!loading && exams.length > 0 && (
        <div className="exams-grid">
          {exams.map((exam) => {
            const examDateTime = new Date(
              `${exam.examDate}T${exam.examTime}`
            );

            const daysLeft = Math.ceil(
              (examDateTime - new Date()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div className="exam-card" key={exam.id}>
                <div className="exam-left-bar" />

                <div className="exam-content">
                  <div className="exam-top">
                    <h5>
                      <FaBookOpen className="me-2 text-primary" />
                      {exam.subjectName}
                    </h5>

                            {daysLeft > 0 && (
                                <span className="exam-badge">
                                    {daysLeft} days left
                                </span>
                            )}

                            {daysLeft <= 0 && (
                                <span className="exam-badge done">
                                    Completed
                                </span>
                            )}
                  </div>

                  <div className="exam-meta">
                    <span>
                      <FaCalendarAlt className="me-1" />
                      {exam.examDate}
                    </span>
                    <span>
                      <FaClock className="me-1" />
                      {exam.examTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
