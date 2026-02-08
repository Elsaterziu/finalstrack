import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaLayerGroup,
  FaClock,
  FaHeartbeat,
  FaSignOutAlt,
  FaGraduationCap
} from "react-icons/fa";

import { useAuth } from "../auth/AuthContext";
import "./StudentLayout.css";

export default function StudentLayout() {
  const { user, logout } = useAuth();
console.log("ME USER:", user);
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
              {user?.fullName || user?.FullName || user?.name || user?.full_name || user?.email}
            </div>

          </div>
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          <NavItem to="/student" icon={<FaTachometerAlt />} label="Dashboard" />
          <NavItem to="/student/exams" icon={<FaBook />} label="Exams" />
          <NavItem to="/student/subjects" icon={<FaLayerGroup />} label="Subjects" />
          <NavItem to="/student/study-blocks" icon={<FaClock />} label="Study Blocks" />
          <NavItem to="/student/stress-logs" icon={<FaHeartbeat />} label="Stress Logs" />
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

/* helper */
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
