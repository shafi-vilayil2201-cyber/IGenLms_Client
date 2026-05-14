import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StudentLayout from "../../layouts/StudentLayout";
import StudentPage from "../../pages/StudentPage";

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <ProtectedRoute allowedRoles={["Student"]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [{ index: true, element: <StudentPage /> }],
      },
    ],
  },
];

export default studentRoutes;
