import { createBrowserRouter, RouterProvider } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import studentRoutes from "./studentRoutes";
import mentorRoutes from "./mentorRoutes";
import adminRoutes from "./adminRoutes";

const router = createBrowserRouter([
  ...publicRoutes,
  ...studentRoutes,
  ...mentorRoutes,
  ...adminRoutes,
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
