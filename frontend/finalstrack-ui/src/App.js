import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import AdminLayout from "./admin/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
