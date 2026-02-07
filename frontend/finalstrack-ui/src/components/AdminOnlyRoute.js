import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminOnlyRoute({ children }) {
  const { user, booting } = useAuth();

  if (booting) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const roles = user?.roles || [];
  const isAdmin = roles.includes("Admin");

  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}
