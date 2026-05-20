import { NavLink } from "react-router-dom";
import {
  BookOpen,
  CheckSquare,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Trophy,
  User,
  Users,
  Video,
} from "lucide-react";
import { useAuthStore } from "../../core/auth/authStore";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/student" },
  { icon: BookOpen, label: "My Courses", to: "/student/courses" },
  { icon: CheckSquare, label: "Daily Habits", to: "/student/habits" },
  { icon: Trophy, label: "Leaderboard", to: "/student/leaderboard" },
  { icon: Users, label: "Mentors", to: "/student/mentors" },
  { icon: Video, label: "Sessions", to: "/student/sessions" },
  { icon: Newspaper, label: "Current Affairs", to: "/student/current-affairs" },
  { icon: User, label: "Profile", to: "/student/profile" },
];

export default function StudentSidebar() {
  const { currentUser, logout } = useAuthStore();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="font-sans text-sm font-bold leading-tight text-sidebar-foreground">IGen LMS</p>
            <p className="text-xs text-sidebar-foreground/50">UPSC Prep</p>
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{currentUser.fullName}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <Flame className="h-3 w-3 text-sidebar-primary" />
                <span className="text-xs text-sidebar-primary">0 day streak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/student"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`
            }
          >
            <link.icon className="h-4 w-4 flex-shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          type="button"
          onClick={() => {
            void logout();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
