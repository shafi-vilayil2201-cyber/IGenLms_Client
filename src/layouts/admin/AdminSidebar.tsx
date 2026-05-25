import {
  Bell,
  BookOpen,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../core/auth/authStore";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: UserCheck, label: "Mentor Management", to: "/admin/mentors" },
  { icon: Users, label: "Student Analytics", to: "/admin/students" },
  { icon: BookOpen, label: "Course Builder", to: "/admin/courses" },
  { icon: Trophy, label: "Leaderboard Control", to: "/admin/leaderboard" },
  { icon: DollarSign, label: "Revenue", to: "/admin/revenue" },
  { icon: Bell, label: "Announcements", to: "/admin/announcements" },
];

export default function AdminSidebar() {
  const { currentUser, logout } = useAuthStore();

  return (
    <aside className="hidden w-64 min-h-screen flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="border-b border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-sidebar-foreground">IGen LMS</p>
            <p className="text-xs text-sidebar-foreground/50">Admin Portal</p>
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{currentUser.fullName}</p>
              <p className="text-xs text-red-400">Super Admin</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
