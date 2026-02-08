import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaBook, FaClock, FaHourglassHalf } from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import { getSubjects } from "../../api/subjectsApi"; 

import "../student/dashboard.css"; 

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState(null);
  const [allSeasons, setAllSeasons] = useState([]);
  const [exams, setExams] = useState([]);
  const [nextExam, setNextExam] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    loadProfessorDashboard();
  }, []);

  const loadProfessorDashboard = async () => {
    try {
      const today = new Date();

      // seasons
      const seasonsRes = await getExamSeasons();
      const seasons = seasonsRes.data || [];
      setAllSeasons(seasons);

      const active = seasons.find(
        (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
      );
      setActiveSeason(active ?? null);

      // subjects count
      try {
        const subsRes = await getSubjects();
        setSubjectsCount((subsRes.data || []).length);
      } catch (e) {
        console.warn("Could not load subjects:", e);
        setSubjectsCount(0);
      }

      if (!active) {
        setExams([]);
        setNextExam(null);
        return;
      }

      // exams in active season
      const examsRes = await getExamsBySeason(active.id);
      const examsData = examsRes.data || [];

      const upcoming = examsData
        .map((e) => ({
          ...e,
          fullDate: new Date(`${e.examDate}T${e.examTime}`)
        }))
        .filter((e) => e.fullDate > today)
        .sort((a, b) => a.fullDate - b.fullDate);

      setExams(examsData);
      setNextExam(upcoming[0] ?? null);
    } catch (err) {
      console.error("Professor dashboard load failed:", err);
    }
  };

  // countdown for next exam
  useEffect(() => {
    if (!nextExam) return;

    const timer = setInterval(() => {
      const diff =
        new Date(`${nextExam.examDate}T${nextExam.examTime}`) - new Date();

      if (diff <= 0) {
        setCountdown(null);
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextExam]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return (exams || []).filter((e) => new Date(`${e.examDate}T${e.examTime}`) > now).length;
  }, [exams]);

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Professor Dashboard</h2>

      {!activeSeason && (
        <div className="alert alert-warning">No active exam season</div>
      )}

      {activeSeason && (
        <>
          <p className="dashboard-subtitle">
            Active Season: <strong>{activeSeason.title}</strong>
          </p>

          <div className="row g-4 mb-4">
            <StatCard
              icon={<FaCalendarAlt />}
              title="Upcoming Exams"
              value={upcomingCount}
              color="info"
            />

            <StatCard
              icon={<FaBook />}
              title="Total Exams (Season)"
              value={exams.length}
              color="primary"
            />

            <StatCard
              icon={<FaHourglassHalf />}
              title="Next Exam"
              value={nextExam?.subjectName ?? "—"}
              sub={nextExam ? `${nextExam.examDate} ${nextExam.examTime}` : ""}
              color="warning"
            />

            <StatCard
              icon={<FaClock />}
              title="Countdown"
              value={countdown ? `${countdown.days}d ${countdown.hours}h` : "—"}
              sub={countdown ? `${countdown.minutes}m remaining` : ""}
              color="success"
            />

            <StatCard
              icon={<FaBook />}
              title="Subjects"
              value={subjectsCount}
              color="danger"
            />
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="dashboard-card">
                <h5>Upcoming Exams</h5>

                {upcomingCount === 0 ? (
                  <div className="text-muted">No upcoming exams in this season.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Room</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exams
                          .slice()
                          .map((e) => ({
                            ...e,
                            fullDate: new Date(`${e.examDate}T${e.examTime}`)
                          }))
                          .filter((e) => e.fullDate > new Date())
                          .sort((a, b) => a.fullDate - b.fullDate)
                          .slice(0, 8)
                          .map((e) => (
                            <tr key={e.id}>
                              <td>{e.subjectName}</td>
                              <td>{e.examDate}</td>
                              <td>{e.examTime}</td>
                              <td>{e.room ?? "-"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="chart-footer">
                  Tip: “Exams” page do ta ketë Create/Edit/Delete (Professor-only).
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const StatCard = ({ icon, title, value, sub, color }) => (
  <div className="col-md-6 col-lg-3">
    <div className="stat-card">
      <div className={`stat-icon ${color || "primary"}`}>{icon}</div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  </div>
);
