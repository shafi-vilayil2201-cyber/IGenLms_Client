import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminCoursesPage from "../../pages/admin/AdminCoursesPage";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AdminMentorsPage from "../../pages/admin/AdminMentorsPage";
import AdminAnnouncementsPage from "../../pages/admin/AdminAnnouncementsPage";
import AdminLeaderboardPage from "../../pages/admin/AdminLeaderboardPage";
import AdminRevenuePage from "../../pages/admin/AdminRevenuePage";
import AdminUsersPage from "../../pages/admin/AdminUsersPage";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "students", element: <AdminUsersPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "mentors", element: <AdminMentorsPage /> },
          { path: "courses", element: <AdminCoursesPage /> },
          { path: "leaderboard", element: <AdminLeaderboardPage /> },
          { path: "revenue", element: <AdminRevenuePage /> },
          { path: "announcements", element: <AdminAnnouncementsPage /> },
        ],
      },
    ],
  },
];

export default adminRoutes;
