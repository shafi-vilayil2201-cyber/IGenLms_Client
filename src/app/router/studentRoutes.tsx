import type { RouteObject } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import StudentPage from "../../pages/StudentPage";


const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <StudentLayout />,
    children: [{ index: true, element: <StudentPage /> }],
  },
];

export default studentRoutes;
