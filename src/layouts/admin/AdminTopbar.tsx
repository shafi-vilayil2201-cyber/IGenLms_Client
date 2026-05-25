import { ThemeToggle } from "../../shared/components/ThemeToggle";
import { useAuthStore } from "../../core/auth/authStore";

export default function AdminTopbar() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Control</p>
        <h1 className="text-base font-semibold text-foreground">Operations Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {currentUser?.fullName?.charAt(0) ?? "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-tight text-foreground">{currentUser?.fullName ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
