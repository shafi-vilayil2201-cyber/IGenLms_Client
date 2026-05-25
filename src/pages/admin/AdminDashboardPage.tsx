import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  DollarSign,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

const statCards = [
  { label: "Active Students", value: "24,582", delta: "+8.4%", icon: Users, color: "#1A7F8E" },
  { label: "Approved Mentors", value: "128", delta: "+12 this month", icon: UserCheck, color: "#009E2C" },
  { label: "Live Courses", value: "52", delta: "+4 launches", icon: BookOpen, color: "#0A1628" },
  { label: "Monthly Revenue", value: "₹18.6L", delta: "+11.2%", icon: DollarSign, color: "#D4A017" },
];

const reviewQueue = [
  { name: "Mentor Applications", count: 9, note: "3 awaiting final verification" },
  { name: "Course Drafts", count: 6, note: "2 missing pricing details" },
  { name: "Leaderboard Flags", count: 4, note: "Potential duplicate attempt logs" },
];

const announcements = [
  { title: "UPSC Prelims Revision Sprint", audience: "All students", status: "Scheduled", time: "Today, 6:00 PM" },
  { title: "Mentor onboarding webinar", audience: "New mentors", status: "Draft", time: "Tomorrow, 11:00 AM" },
  { title: "Polity batch fee revision", audience: "Sales + Admin", status: "Published", time: "May 26, 9:30 AM" },
];

const cohortHealth = [
  { cohort: "Foundation 2027", completion: 82, risk: "Low" },
  { cohort: "Current Affairs Intensive", completion: 67, risk: "Medium" },
  { cohort: "Optional Subject Cohort", completion: 54, risk: "High" },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section
        className="relative overflow-hidden rounded-3xl border border-border p-6 text-white"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #12315b 100%)" }}
      >
        <div className="absolute inset-y-0 right-0 w-72 bg-[radial-gradient(circle_at_top_right,_rgba(0,158,44,0.3),_transparent_55%)]" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-white/70">IGen LMS admin panel</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Track growth, moderation, and delivery from one control surface.</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Keep mentor approvals, cohort performance, leaderboards, and monetization under one operational loop.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Pending reviews</p>
              <p className="mt-2 text-2xl font-bold text-white">19</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Revenue target</p>
              <p className="mt-2 text-2xl font-bold text-white">78%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">System health</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
                Stable <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: `${card.color}18` }}>
                  <Icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: card.color }}>
                {card.delta} <ArrowUpRight className="h-4 w-4" />
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Review Queue</h3>
              <p className="mt-1 text-sm text-muted-foreground">Items that need admin action today.</p>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Priority first</div>
          </div>

          <div className="mt-5 space-y-3">
            {reviewQueue.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{item.count}</p>
                  <p className="text-xs text-muted-foreground">open</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-foreground">Attention Needed</h3>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Cohort drop-off spike</p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Optional Subject Cohort completion dropped 9% in the last 5 days.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Mentor slot utilization</p>
              <p className="mt-1 text-xs text-muted-foreground">Saturday evening review slots are 96% booked.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Announcement backlog</p>
              <p className="mt-1 text-xs text-muted-foreground">2 scheduled campaigns still need compliance copy review.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-brand-teal" />
            <h3 className="text-lg font-bold text-foreground">Announcement Pipeline</h3>
          </div>
          <div className="mt-5 space-y-3">
            {announcements.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.audience}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand-green" />
            <h3 className="text-lg font-bold text-foreground">Cohort Health</h3>
          </div>
          <div className="mt-5 space-y-4">
            {cohortHealth.map((cohort) => (
              <div key={cohort.cohort}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <p className="font-semibold text-foreground">{cohort.cohort}</p>
                  <span className="text-muted-foreground">{cohort.risk} risk</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cohort.completion}%`,
                      background:
                        cohort.risk === "Low" ? "#009E2C" : cohort.risk === "Medium" ? "#D4A017" : "#dc2626",
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{cohort.completion}% module completion</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
