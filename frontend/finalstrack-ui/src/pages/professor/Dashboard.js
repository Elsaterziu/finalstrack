import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaBook, FaUsers } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import { getSubjects } from "../../api/subjectsApi";
import { getStudentsCount } from "../../api/usersApi";

import "../professor/professor.css";

const BAR_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
];

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState(null);
  const [allSeasons, setAllSeasons] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjectsCount, setSubjectsCount] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExams, setSelectedExams] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const today = new Date();

      const seasonsRes = await getExamSeasons();
      const seasons = seasonsRes.data || [];
      setAllSeasons(seasons);

      const active = seasons.find(
        s =>
          new Date(s.startDate) <= today &&
          new Date(s.endDate) >= today
      );

      setActiveSeason(active ?? null);

      const subjectsRes = await getSubjects();
      setSubjectsCount((subjectsRes.data || []).length);

      const examsPromises = seasons.map(season =>
        getExamsBySeason(season.id)
      );

      const examsResults = await Promise.all(examsPromises);

      const allExamsData = examsResults.flatMap(
        res => res.data || []
      );

      setExams(allExamsData);

      const studentsRes = await getStudentsCount();
      setStudentsCount(studentsRes.data || 0);

    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return exams.filter(
      e => new Date(`${e.examDate}T${e.examTime}`) > now
    ).length;
  }, [exams]);

  const next7DaysExams = useMemo(() => {
    const now = new Date();
    const next7 = new Date();
    next7.setDate(now.getDate() + 7);

    return exams
      .map(e => ({
        ...e,
        fullDate: new Date(`${e.examDate}T${e.examTime}`)
      }))
      .filter(e => e.fullDate > now && e.fullDate <= next7)
      .sort((a, b) => a.fullDate - b.fullDate)
      .slice(0, 8);
  }, [exams]);

  const examsPerSeason = useMemo(() => {
    return allSeasons.map(season => ({
      name: season.title,
      exams: exams.filter(
        e => e.examSeasonId === season.id
      ).length
    }));
  }, [allSeasons, exams]);

  const handleDateClick = date => {
    setSelectedDate(date);

    const examsOnDate = exams.filter(
      e =>
        new Date(e.examDate).toDateString() ===
        date.toDateString()
    );

    setSelectedExams(examsOnDate);
  };

  return (
    <div className="dashboard-page professor-dashboard">

      <h2 className="dashboard-title">Professor Dashboard</h2>

      {activeSeason && (
        <p className="dashboard-subtitle">
          Active Season: <strong>{activeSeason.title}</strong>
        </p>
      )}

      {/* ===== STAT CARDS ===== */}

      <div className="stats-row">
        <StatCard
          icon={<FaCalendarAlt />}
          title="Total Exam Seasons"
          value={allSeasons.length}
          color="secondary"
        />

        <StatCard
          icon={<FaCalendarAlt />}
          title="Upcoming Exams"
          value={upcomingCount}
          color="info"
        />

        <StatCard
          icon={<FaBook />}
          title="Total Exams (Season)"
          value={
            activeSeason
              ? exams.filter(e => e.examSeasonId === activeSeason.id).length
              : 0
          }
          color="primary"
        />

        <StatCard
          icon={<FaBook />}
          title="Subjects"
          value={subjectsCount}
          color="danger"
        />

         <StatCard
          icon={<FaUsers />}
          title="Total Students"
          value={studentsCount}
          color="secondary"
        />
      </div>

      {/* ===== UPCOMING TABLE ===== */}
      <div className="dashboard-card">
        <h5>Upcoming Exams (Next 7 Days)</h5>

        {next7DaysExams.length === 0 ? (
          <div className="text-muted">
            No upcoming exams in the next 7 days.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {next7DaysExams.map((e) => {
                  const diff =
                    new Date(`${e.examDate}T${e.examTime}`) -
                    new Date();

                  const daysLeft = Math.ceil(
                    diff / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={e.id}>
                      <td>{e.subjectName}</td>
                      <td>{e.examDate}</td>
                      <td>
                        <span className="status-badge">
                          In {daysLeft} days
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== CHART + CALENDAR ===== */}

      <div className="chart-calendar-grid">

        <div className="dashboard-card">
          <h5>Exams Per Season</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examsPerSeason}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="exams" radius={[6, 6, 0, 0]}>
                {examsPerSeason.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h5>Exam Calendar</h5>

          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const hasExam = exams.some(
                e =>
                  new Date(e.examDate).toDateString() ===
                  date.toDateString()
              );

              return hasExam ? (
                <div className="calendar-dot" />
              ) : null;
            }}
          />

          {selectedDate && (
            <div className="calendar-exams">
              <h6>
                Exams on {selectedDate.toDateString()}
              </h6>

              {selectedExams.length === 0 && (
                <div className="text-muted">
                  No exams on this date.
                </div>
              )}

              {selectedExams.map(exam => (
                <div key={exam.id} className="exam-preview-card">
                  <strong>{exam.subjectName}</strong>
                  <div>{exam.examTime}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card-wrapper">
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  </div>
);