import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProfessorOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const roles = user.roles || [];
  const isProfessor = roles.includes("Professor");

  return isProfessor ? children : <Navigate to="/student" replace />;
}
