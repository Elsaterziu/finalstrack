import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaLayerGroup,
  FaClock,
  FaHeartbeat
} from "react-icons/fa";

import "./StudentLayout.css";

export default function StudentLayout() {
  return (
    <div className="student-layout">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <div className="sidebar-brand">
          FinalsTrack
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/student" icon={<FaTachometerAlt />} label="Dashboard" />
          <NavItem to="/student/exams" icon={<FaBook />} label="Exams" />
          <NavItem to="/student/subjects" icon={<FaLayerGroup />} label="Subjects" />
          <NavItem to="/student/study-blocks" icon={<FaClock />} label="Study Blocks" />
          <NavItem to="/student/stress-logs" icon={<FaHeartbeat />} label="Stress Logs" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}

/* SMALL HELPER */
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `sidebar-link ${isActive ? "active" : ""}`
    }
  >
    <span className="sidebar-icon">{icon}</span>
    <span>{label}</span>
  </NavLink>
);
