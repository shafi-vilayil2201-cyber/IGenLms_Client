import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MentorLayout from "../../layouts/mentor/MentorLayout";
import MentorDashboardPage from "../../pages/mentor/MentorDashboardPage";
import MentorProfilePage from "../../pages/mentor/MentorProfilePage";
import MentorSessionsPage from "../../pages/mentor/MentorSessionsPage";
import MentorStudentsPage from "../../pages/mentor/MentorStudentsPage";

const mentorRoutes: RouteObject[] = [
  {
    path: "/mentor",
    element: <ProtectedRoute allowedRoles={["Mentor"]} />,
    children: [
      {
        element: <MentorLayout />,
        children: [
          { index: true, element: <MentorDashboardPage /> },
          { path: "students", element: <MentorStudentsPage /> },
          { path: "sessions", element: <MentorSessionsPage /> },
          { path: "profile", element: <MentorProfilePage /> },
        ],
      },
    ],
  },
];

export default mentorRoutes;
