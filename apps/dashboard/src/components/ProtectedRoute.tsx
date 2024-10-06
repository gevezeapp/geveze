import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  project = false,
}: {
  children: React.ReactNode;
  project?: boolean;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={"/auth /login"} />;
  }

  if (project && !user.project) {
    return <Navigate to={"/create-project"} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
