import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../core/auth/authStore";
import type { UserRole } from "../../core/auth/auth.types";

function getNextRoute(nextStep?: string, role?: string) {
  if (nextStep === "AdminDashboard" || role === "Admin") {
    return "/admin";
  }

  if (nextStep === "MentorOnboarding" || role === "Mentor") {
    return "/mentor";
  }

  return "/student";
}

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, hasCheckedSession, refreshSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!hasCheckedSession) {
      void refreshSession();
    }
  }, [hasCheckedSession, refreshSession]);

  if (!hasCheckedSession) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getNextRoute(currentUser.nextStep, currentUser.role)} replace />;
  }

  return <Outlet />;
}
