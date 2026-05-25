import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StudentLayout from "../../layouts/student/StudentLayout";
import StudentDashboardPage from "../../pages/student/StudentDashboardPage";
import StudentCoursesPage from "../../pages/student/StudentCoursesPage";
import StudentProfilePage from "../../pages/student/StudentProfilePage";
import StudentReviewsPage from "../../pages/student/StudentReviewsPage";
import StudentHabitsPage from "../../pages/student/StudentHabitsPage";

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <ProtectedRoute allowedRoles={["Student"]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentDashboardPage /> },
          { path: "courses", element: <StudentCoursesPage /> },
          { path: "habits", element: <StudentHabitsPage /> },
          { path: "reviews", element: <StudentReviewsPage /> },
          { path: "profile", element: <StudentProfilePage /> },
        ],
      },
    ],
  },
];

export default studentRoutes;
