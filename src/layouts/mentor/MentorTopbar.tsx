import { useAuthStore } from "../../core/auth/authStore";

export default function MentorTopbar() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <p className="text-sm text-slate-500">Mentor Dashboard</p>
      <h1 className="text-xl font-semibold text-slate-950">{currentUser?.fullName ?? "Mentor"}</h1>
    </header>
  );
}
