import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminRoles from "./admin/AdminRoles";
import AdminSettings from "./admin/AdminSettings";

import StudentLayout from "./layouts/StudentLayout";
import Exams from "./pages/student/Exams";
import Subjects from "./pages/student/Subjects";
import StudyBlocks from "./pages/student/StudyBlocks";
import StressLogs from "./pages/student/StressLogs";

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

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/auth" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
