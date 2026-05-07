import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <main>
      <h1>Admin Layout</h1>
      <Outlet />
    </main>
  );
}
