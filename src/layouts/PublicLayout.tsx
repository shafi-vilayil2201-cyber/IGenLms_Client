import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main>
      <h1>Public Layout</h1>
      <Outlet />
    </main>
  );
}
