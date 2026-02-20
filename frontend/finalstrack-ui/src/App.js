import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthPage from "./pages/AuthPage";

// Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import ProfessorOnlyRoute from "./components/ProfessorOnlyRoute";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./admin/AdminLayout";
import ProfessorLayout from "./layouts/ProfessorLayout";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import Exams from "./pages/student/Exams";
import Subjects from "./pages/student/Subjects";
import StudyBlocks from "./pages/student/StudyBlocks";
import StressLogs from "./pages/student/StressLogs";
import Profile from "./pages/student/Profile";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminRoles from "./admin/AdminRoles";
import AdminSettings from "./admin/AdminSettings";

// Professor pages
import ProfessorDashboard from "./pages/professor/Dashboard";
import ProfessorExams from "./pages/professor/Exams";
import ProfessorSubjects from "./pages/professor/Subjects";
import ProfessorExamSeasons from "./pages/professor/ExamSeasons";
import ProfessorProfile from "./pages/professor/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* AUTH */}
          <Route path="/auth" element={<AuthPage />} />

          {/* STUDENT */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="exams" element={<Exams />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="study-blocks" element={<StudyBlocks />} />
            <Route path="stress-logs" element={<StressLogs />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminOnlyRoute>
                <AdminLayout />
              </AdminOnlyRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* PROFESSOR */}
          <Route
            path="/professor"
            element={
              <ProfessorOnlyRoute>
                <ProfessorLayout />
              </ProfessorOnlyRoute>
            }
          >
            <Route index element={<ProfessorDashboard />} />
            <Route path="exams" element={<ProfessorExams />} />
            <Route path="subjects" element={<ProfessorSubjects />} />
            <Route path="exam-seasons" element={<ProfessorExamSeasons />} />
            <Route path="profile" element={<ProfessorProfile />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
