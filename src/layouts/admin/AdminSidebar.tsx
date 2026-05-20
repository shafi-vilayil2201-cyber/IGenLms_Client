import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Mentors", to: "/admin/mentors" },
  { label: "Courses", to: "/admin/courses" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Admin</h2>
      <nav className="mt-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
