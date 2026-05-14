import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import PublicOnlyRoute from "./PublicOnlyRoute";

const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/register/student", element: <RegisterPage /> },
          { path: "/register/mentor", element: <RegisterPage /> },
        ],
      },
    ],
  },
];

export default publicRoutes;
