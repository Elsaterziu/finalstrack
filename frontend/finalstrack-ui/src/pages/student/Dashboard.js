import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaBrain,
  FaHourglassHalf
} from "react-icons/fa";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import { getStudyBlocksByExam } from "../../api/studyBlocksApi";
import { getStressLogsByExam } from "../../api/stressLogsApi";

import StressChart from "../../components/charts/StressChart";
import StudyTimeChart from "../../components/charts/StudyTimeChart";

import "./dashboard.css";

/* helper */
const formatMinutes = (minutes) => {
  if (!minutes || minutes <= 0) return "0 min";
  if (minutes < 60) return `${minutes} min`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState(null);
  const [exams, setExams] = useState([]);
  const [nextExam, setNextExam] = useState(null);

  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [stressLogs, setStressLogs] = useState([]);
  const [avgStress, setAvgStress] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const today = new Date();
      const seasons = (await getExamSeasons()).data;

      const active = seasons.find(
        (s) =>
          new Date(s.startDate) <= today &&
          new Date(s.endDate) >= today
      );

      if (!active) return;
      setActiveSeason(active);

      const examsData = (await getExamsBySeason(active.id)).data;

      const upcoming = examsData
        .map((e) => ({
          ...e,
          fullDate: new Date(`${e.examDate}T${e.examTime}`)
        }))
        .filter((e) => e.fullDate > today)
        .sort((a, b) => a.fullDate - b.fullDate);

      setNextExam(upcoming[0] ?? null);

      let totalMinutes = 0;
      let stressSum = 0;
      let stressCount = 0;
      let allLogs = [];

      for (const exam of examsData) {
        const blocks = (await getStudyBlocksByExam(exam.id)).data;
        const examMinutes = blocks.reduce(
          (sum, b) => sum + b.durationMinutes,
          0
        );

        totalMinutes += examMinutes;
        exam.totalStudyMinutes = examMinutes;

        const logs = (await getStressLogsByExam(exam.id)).data;
        allLogs.push(...logs);

        stressSum += logs.reduce((s, l) => s + l.stressLevel, 0);
        stressCount += logs.length;
      }

      setExams([...examsData]);
      setStressLogs(allLogs);
      setTotalStudyMinutes(totalMinutes);
      setAvgStress(
        stressCount ? (stressSum / stressCount).toFixed(1) : null
      );
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  /* countdown */
  useEffect(() => {
    if (!nextExam) return;

    const timer = setInterval(() => {
      const diff =
        new Date(`${nextExam.examDate}T${nextExam.examTime}`) -
        new Date();

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

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Student Dashboard</h2>

      {!activeSeason && (
        <div className="alert alert-warning">
          No active exam season
        </div>
      )}

      {activeSeason && (
        <>
          <p className="dashboard-subtitle">
            Active Season: <strong>{activeSeason.title}</strong>
          </p>

          {/* ===== TOP 4 CARDS ===== */}
          <div className="row g-4 mb-4">
            <StatCard
              icon={<FaCalendarAlt />}
              title="Upcoming Exams"
              value={exams.length}
              color="info"
            />

            <StatCard
              icon={<FaBook />}
              title="Next Exam"
              value={nextExam?.subjectName ?? "—"}
              sub={
                nextExam
                  ? `${nextExam.examDate} ${nextExam.examTime}`
                  : ""
              }
              color="primary"
            />

            <StatCard
              icon={<FaHourglassHalf />}
              title="Countdown"
              value={
                countdown
                  ? `${countdown.days}d ${countdown.hours}h`
                  : "—"
              }
              sub={
                countdown
                  ? `${countdown.minutes}m remaining`
                  : ""
              }
              color="warning"
            />

            <StatCard
              icon={<FaClock />}
              title="Study Time"
              value={formatMinutes(totalStudyMinutes)}
              sub={`${totalStudyMinutes} min total`}
              color="success"
            />
          </div>

          {/* ===== AVG STRESS (separate row for balance) ===== */}
          <div className="row mb-4">
            <StatCard
              icon={<FaBrain />}
              title="Avg Stress"
              value={avgStress ?? "-"}
              danger={avgStress >= 7}
              color="danger"
            />
          </div>

          {/* ===== CHARTS ===== */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="dashboard-card">
                <h5>Stress Over Time</h5>
                <StressChart logs={stressLogs} />
                <div className="chart-footer">
                  Avg stress: <b>{avgStress}/10</b>
                  {avgStress >= 7 && (
                    <span className="stress-warning">
                      High stress detected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="dashboard-card">
                <h5>Study Time per Exam</h5>
                <StudyTimeChart exams={exams} />
                <div className="chart-footer">
                  Total accumulated study time per exam
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* reusable stat card */
const StatCard = ({ icon, title, value, sub, danger, color }) => (
  <div className="col-12 col-md-6 col-lg-3">
    <div className={`stat-card ${danger ? "stat-danger" : ""}`}>
      <div className={`stat-icon ${color || "primary"}`}>
        {icon}
      </div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  </div>
);