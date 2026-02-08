import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaLayerGroup,
  FaSignOutAlt,
  FaGraduationCap,
  FaCalendarAlt
} from "react-icons/fa";

import { useAuth } from "../auth/AuthContext";
import "./StudentLayout.css"; 

export default function ProfessorLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        {/* BRAND */}
        <div className="sidebar-brand-box">
          <div className="sidebar-logo">
            <FaGraduationCap />
          </div>
          <div className="sidebar-brand-text">
            <div className="brand-name">FinalsTrack</div>
            <div className="brand-sub">
              {user?.fullName || user?.FullName || user?.name || user?.email}
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          <NavItem to="/professor" icon={<FaTachometerAlt />} label="Dashboard" />
          <NavItem to="/professor/exams" icon={<FaBook />} label="Exams" />
          <NavItem to="/professor/subjects" icon={<FaLayerGroup />} label="Subjects" />
          <NavItem to="/professor/exam-seasons" icon={<FaCalendarAlt />} label="Exam Seasons" />
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-footer">
          <div
            className="sidebar-link logout-link"
            role="button"
            tabIndex={0}
            onClick={logout}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") logout();
            }}
          >
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
  >
    <span className="sidebar-icon">{icon}</span>
    <span>{label}</span>
  </NavLink>
);
