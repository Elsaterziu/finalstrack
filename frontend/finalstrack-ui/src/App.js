import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthPage from "./pages/AuthPage";
import AdminUsers from "./pages/AdminUsers";
import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";

import AdminLayout from "./admin/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* AUTH */}
          <Route path="/auth" element={<AuthPage />} />

          {/* STUDENT AREA */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="exams" element={<div>Exams page (next)</div>} />
            <Route path="subjects" element={<div>Subjects page (next)</div>} />
            <Route path="study-blocks" element={<div>Study Blocks page (next)</div>} />
            <Route path="stress-logs" element={<div>Stress Logs page (next)</div>} />
          </Route>

          {/* ADMIN AREA */}
          <Route
            path="/admin"
            element={
              <AdminOnlyRoute>
                <AdminLayout />
              </AdminOnlyRoute>
            }
          >
            <Route index element={<AdminUsers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<div>Roles page (next)</div>} />
            <Route path="settings" element={<div>Settings page (next)</div>} />
            <Route path="profile" element={<div>Edit profile (next)</div>} />
            <Route path="password" element={<div>Change password (next)</div>} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/auth" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
