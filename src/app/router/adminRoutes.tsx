import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../../layouts/AdminLayout";
import AdminPage from "../../pages/AdminPage";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminPage /> }],
      },
    ],
  },
];

export default adminRoutes;
