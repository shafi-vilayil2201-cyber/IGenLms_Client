import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminCoursesPage from "../../pages/admin/AdminCoursesPage";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AdminMentorsPage from "../../pages/admin/AdminMentorsPage";
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
          { path: "users", element: <AdminUsersPage /> },
          { path: "mentors", element: <AdminMentorsPage /> },
          { path: "courses", element: <AdminCoursesPage /> },
        ],
      },
    ],
  },
];

export default adminRoutes;
