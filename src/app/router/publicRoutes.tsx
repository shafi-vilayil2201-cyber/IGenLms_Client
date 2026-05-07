import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";

const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
];

export default publicRoutes;
