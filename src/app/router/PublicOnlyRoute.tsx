import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../core/auth/authStore";

function getNextRoute(nextStep?: string, role?: string) {
  if (nextStep === "AdminDashboard" || role === "Admin") {
    return "/admin";
  }

  if (nextStep === "MentorOnboarding" || role === "Mentor") {
    return "/mentor";
  }

  return "/student";
}

export default function PublicOnlyRoute() {
  const { currentUser, hasCheckedSession, refreshSession } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedSession) {
      void refreshSession();
    }
  }, [hasCheckedSession, refreshSession]);

  if (!hasCheckedSession) {
    return null;
  }

  if (currentUser) {
    return <Navigate to={getNextRoute(currentUser.nextStep, currentUser.role)} replace />;
  }

  return <Outlet />;
}
