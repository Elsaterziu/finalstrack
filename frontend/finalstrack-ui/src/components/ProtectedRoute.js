import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();

  if (booting) return null; // mundesh me bo edhe loading
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
