import type { RouteObject } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AdminPage from "../../pages/AdminPage";


const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ index: true, element: <AdminPage /> }],
  },
];

export default adminRoutes;
