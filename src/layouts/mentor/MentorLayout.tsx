import { Outlet } from "react-router-dom";
import MentorSidebar from "./MentorSidebar";
import MentorTopbar from "./MentorTopbar";

export default function MentorLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <MentorSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MentorTopbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
