import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminRoles from "./admin/AdminRoles";
import AdminSettings from "./admin/AdminSettings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* AUTH */}
          <Route path="/auth" element={<AuthPage />} />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

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
