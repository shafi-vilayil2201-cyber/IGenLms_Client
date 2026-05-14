import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MentorLayout from "../../layouts/MentorLayout";
import MentorPage from "../../pages/MentorPage";

const mentorRoutes: RouteObject[] = [
  {
    path: "/mentor",
    element: <ProtectedRoute allowedRoles={["Mentor"]} />,
    children: [
      {
        element: <MentorLayout />,
        children: [{ index: true, element: <MentorPage /> }],
      },
    ],
  },
];

export default mentorRoutes;
