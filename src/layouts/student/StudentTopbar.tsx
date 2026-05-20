import { Bell, Search } from "lucide-react";
import { useAuthStore } from "../../core/auth/authStore";

export default function StudentTopbar() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex max-w-md flex-1 items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search topics, tests, mentors..."
            className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-muted-foreground md:block">{today}</span>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
        >
          <Bell className="h-4 w-4 text-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-green" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
            {currentUser?.fullName.charAt(0).toUpperCase() ?? "S"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-tight text-foreground">{currentUser?.fullName ?? "Student"}</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
