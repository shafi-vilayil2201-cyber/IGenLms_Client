import { Outlet } from "react-router-dom";

export default function MentorLayout() {
  return (
    <main>
      <h1>Mentor Layout</h1>
      <Outlet />
    </main>
  );
}
