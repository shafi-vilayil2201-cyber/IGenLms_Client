import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../core/auth/authStore";
import type { RegisterRequest, UserRole } from "../../core/auth/auth.types";

function getNextRoute(nextStep?: string, role?: string) {
  if (nextStep === "AdminDashboard" || role === "Admin") {
    return "/admin";
  }

  if (nextStep === "MentorOnboarding" || role === "Mentor") {
    return "/mentor";
  }

  return "/student";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuthStore();
  const defaultRole: RegisterRequest["role"] = location.pathname.includes("/mentor")
    ? "Mentor"
    : "Student";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: defaultRole,
    targetYear: "",
    expertise: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      role: defaultRole,
    }));
    setError("");
  }, [defaultRole]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleRoleToggle(role: Exclude<UserRole, "Admin">) {
    if (role === form.role) {
      return;
    }

    navigate(role === "Mentor" ? "/register/mentor" : "/register/student");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload: RegisterRequest = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    if (form.role === "Student") {
      const year = Number(form.targetYear);

      if (Number.isNaN(year) || year < 2024 || year > 2100) {
        setError("Please enter a valid target year.");
        return;
      }

      payload.targetYear = year;
    }

    if (form.role === "Mentor") {
      if (!form.expertise.trim()) {
        setError("Expertise is required.");
        return;
      }

      payload.expertise = form.expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    setLoading(true);

    try {
      const result = await register(payload);

      if (result.success) {
        setSubmitted(true);
        const user = useAuthStore.getState().currentUser;
        redirectTimeoutRef.current = window.setTimeout(() => {
          navigate(getNextRoute(user?.nextStep, user?.role), { replace: true });
        }, 1200);
        return;
      }

      setError("error" in result ? result.error : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0A1628" }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#009E2C" }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-foreground text-lg block">
                {form.role === "Mentor" ? "Become an IGen Mentor" : "Create Your Account"}
              </span>
              <span className="text-sm text-muted-foreground">
                {form.role === "Mentor"
                  ? "Guide serious aspirants and earn through structured reviews."
                  : "Start your disciplined preparation journey with IGen LMS."}
              </span>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#22c55e20" }}>
                <ArrowRight className="w-7 h-7" style={{ color: "#22c55e" }} />
              </div>
              <p className="font-semibold text-foreground">Registration submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">Redirecting to your account...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Register As</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl p-1" style={{ background: "#F3F4F6" }}>
                  {(["Student", "Mentor"] as const).map((role) => {
                    const active = form.role === role;

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        data-testid={`toggle-role-${role.toLowerCase()}`}
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                        style={active
                          ? { background: "#009E2C", color: "#ffffff", boxShadow: "0 8px 24px rgba(0,158,44,0.18)" }
                          : { background: "transparent", color: "#4B5563" }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Arjun Sharma"
                  required
                  data-testid="input-fullName"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  data-testid="input-email"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
              </div>
              {form.role === "Student" ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Target Year</label>
                  <input
                    type="number"
                    name="targetYear"
                    value={form.targetYear}
                    onChange={handleChange}
                    placeholder="2027"
                    required
                    min="2024"
                    max="2100"
                    data-testid="input-targetYear"
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Expertise</label>
                  <input
                    type="text"
                    name="expertise"
                    value={form.expertise}
                    onChange={handleChange}
                    placeholder="Polity, Ethics, Essay"
                    required
                    data-testid="input-expertise"
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                  />
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-testid="input-password"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-testid="input-confirmPassword"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
              </div>

              {error ? (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </div>
              ) : null}

              <button type="submit" data-testid="button-register"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "#009E2C" }}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold hover:underline"
              style={{ color: "#009E2C" }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
