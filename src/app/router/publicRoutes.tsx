import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/public/PublicLayout";
import LandingPage from "../../pages/public/LandingPage";
import LoginPage from "../../pages/public/LoginPage";
import RegisterPage from "../../pages/public/RegisterPage";
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
