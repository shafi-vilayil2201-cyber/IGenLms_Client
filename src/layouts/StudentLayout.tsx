import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <main>
      <h1>Student Layout</h1>
      <Outlet />
    </main>
  );
}
