import { useEffect, useState } from "react";
import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import { getStudyBlocksByExam } from "../../api/studyBlocksApi";
import { getStressLogsByExam } from "../../api/stressLogsApi";

const Dashboard = () => {
  const [activeSeason, setActiveSeason] = useState(null);
  const [exams, setExams] = useState([]);
  const [nextExam, setNextExam] = useState(null);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [avgStress, setAvgStress] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  // Load dashboard data from backend
  const loadDashboard = async () => {
    try {
      const seasons = (await getExamSeasons()).data;
      const today = new Date();

      // Find active season (date-based)
      const active = seasons.find(
        (s) =>
          new Date(s.startDate) <= today &&
          new Date(s.endDate) >= today
      );

      if (!active) return;
      setActiveSeason(active);

      // Load exams for active season
      const examsData = (await getExamsBySeason(active.id)).data;
      setExams(examsData);

      // Find next upcoming exam
      const upcoming = examsData
        .map((e) => ({
          ...e,
          fullDate: new Date(`${e.examDate}T${e.examTime}`),
        }))
        .filter((e) => e.fullDate > today)
        .sort((a, b) => a.fullDate - b.fullDate);

      if (upcoming.length > 0) {
        setNextExam(upcoming[0]);
      }

      // Aggregate study blocks & stress logs
      let studyMinutes = 0;
      let stressSum = 0;
      let stressCount = 0;

      for (const exam of examsData) {
        const blocks = (await getStudyBlocksByExam(exam.id)).data;
        studyMinutes += blocks.reduce(
          (sum, b) => sum + b.durationMinutes,
          0
        );

        const logs = (await getStressLogsByExam(exam.id)).data;
        const examStressSum = logs.reduce(
          (sum, l) => sum + l.stressLevel,
          0
        );

        stressSum += examStressSum;
        stressCount += logs.length;
      }

      setTotalStudyMinutes(studyMinutes);
      setAvgStress(
        stressCount > 0 ? (stressSum / stressCount).toFixed(1) : null
      );
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  // Countdown logic (updates every second)
  useEffect(() => {
    if (!nextExam) return;

    const interval = setInterval(() => {
      const now = new Date();
      const examDateTime = new Date(
        `${nextExam.examDate}T${nextExam.examTime}`
      );

      const diff = examDateTime - now;

      if (diff <= 0) {
        setCountdown(null);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextExam]);

  return (
    <div>
      <h2 className="mb-4">Student Dashboard</h2>

      {!activeSeason && (
        <div className="alert alert-warning">
          No active exam season
        </div>
      )}

      {activeSeason && (
        <>
          <p className="text-muted">
            Active Season: <strong>{activeSeason.title}</strong>
          </p>

          <div className="row g-4">
            {/* Upcoming Exams */}
            <div className="col-md-6 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Upcoming Exams</h6>
                  <h3>{exams.length}</h3>
                </div>
              </div>
            </div>

            {/* Next Exam */}
            <div className="col-md-6 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Next Exam</h6>
                  {nextExam ? (
                    <>
                      <strong>{nextExam.subjectName}</strong>
                      <div className="small text-muted">
                        {nextExam.examDate} {nextExam.examTime}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="col-md-6 col-lg-3">
              <div className="card shadow-sm border-primary">
                <div className="card-body">
                  <h6 className="text-muted">Exam Countdown</h6>
                  {countdown ? (
                    <>
                      <strong className="fs-5">
                        {countdown.days}d {countdown.hours}h
                      </strong>
                      <div className="small text-muted">
                        {countdown.minutes}m {countdown.seconds}s remaining
                      </div>
                    </>
                  ) : (
                    <span className="text-muted">No upcoming exam</span>
                  )}
                </div>
              </div>
            </div>

            {/* Study Time */}
            <div className="col-md-6 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Study Time</h6>
                  <h3>{totalStudyMinutes} min</h3>
                </div>
              </div>
            </div>

            {/* Stress */}
            <div className="col-md-6 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Avg Stress</h6>
                  <h3>{avgStress ?? "-"}</h3>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
