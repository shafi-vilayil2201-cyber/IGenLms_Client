import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#eff5fb_40%,#e6eef9_100%)]">
      <Outlet />
    </main>
  );
}
