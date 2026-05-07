import type { RouteObject } from "react-router-dom";
import MentorLayout from "../../layouts/MentorLayout";
import MentorPage from "../../pages/MentorPage";


const mentorRoutes: RouteObject[] = [
  {
    path: "/mentor",
    element: <MentorLayout />,
    children: [{ index: true, element: <MentorPage /> }],
  },
];

export default mentorRoutes;
