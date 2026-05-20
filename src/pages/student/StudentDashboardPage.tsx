import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Flame,
  Lock,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { getStudentDashboard, getTodayStudentHabits } from "../../core/student/student.api";
import { useAuthStore } from "../../core/auth/authStore";
import type { StudentHabit } from "../../core/student/student.types";

const NAVY = "#0A1628";
const GREEN = "#009E2C";
const GOLD = "#D4A017";
const TEAL = "#1A7F8E";

const announcements = [
  { id: "a1", type: "Important", title: "Weekly answer-writing review opens tonight at 8 PM." },
  { id: "a2", type: "Event", title: "Mentor Q&A session on polity revision is scheduled this weekend." },
  { id: "a3", type: "Update", title: "Current affairs digest for this week is now available." },
];

const mockCourses = [
  {
    id: "c1",
    title: "UPSC Foundation Batch",
    category: "GS Core",
    instructor: "Dr. Ramesh Kumar",
    rating: 4.8,
    progress: 35,
  },
  {
    id: "c2",
    title: "Current Affairs Intensive",
    category: "Current Affairs",
    instructor: "Meera Nair",
    rating: 4.7,
    progress: 60,
  },
];

const mockSessions = [
  {
    id: "s1",
    type: "Weekly Review",
    subject: "Polity",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: "Booked",
  },
  {
    id: "s2",
    type: "Doubt Clearing",
    subject: "Economy",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: "Booked",
  },
];

const fallbackHabits = [
  { key: "study", label: "Topic Study", points: 10, icon: BookOpen },
  { key: "quiz", label: "Daily Quiz", points: 10, icon: CheckCircle },
  { key: "current-affairs", label: "Newspaper Reading", points: 10, icon: AlertCircle },
  { key: "exercise", label: "Exercise", points: 10, icon: TrendingUp },
];

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getHabitIcon(habitType: string) {
  const normalized = habitType.toLowerCase();
  if (normalized.includes("current")) return AlertCircle;
  if (normalized.includes("revision")) return CheckCircle;
  if (normalized.includes("exercise")) return TrendingUp;
  return BookOpen;
}

function HabitCard({ habit }: { habit: StudentHabit }) {
  const Icon = getHabitIcon(habit.habitType);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        habit.isCompletedToday ? "border-green-200 bg-green-50" : "border-border bg-muted/30"
      }`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          habit.isCompletedToday ? "bg-green-500" : "bg-muted"
        }`}
      >
        <Icon className={`h-4 w-4 ${habit.isCompletedToday ? "text-white" : "text-muted-foreground"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold" style={{ color: NAVY }}>
          {habit.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {habit.points} pts · {habit.targetMinutes} min
        </p>
      </div>
      {habit.isCompletedToday && <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />}
    </div>
  );
}

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const dashboardQuery = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: getStudentDashboard,
  });

  const habitsQuery = useQuery({
    queryKey: ["student-habits-today"],
    queryFn: getTodayStudentHabits,
  });

  if (dashboardQuery.isLoading || habitsQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        Unable to load student dashboard.
      </div>
    );
  }

  const dashboard = dashboardQuery.data;
  const habits = habitsQuery.data ?? [];
  const habitCards = habits.length > 0 ? habits : null;
  const completedHabitCount = habits.filter((habit) => habit.isCompletedToday).length;
  const totalHabitCount = habits.length || fallbackHabits.length;
  const disciplineScore = totalHabitCount ? completedHabitCount / totalHabitCount : 0;
  const currentWeek = Math.max(1, Math.ceil((dashboard?.targetYear || new Date().getFullYear()) % 20));
  const leaderboard = [
    { userId: dashboard?.userId ?? 0, rank: dashboard?.rank || 1, name: "You", city: "Kerala", score: 820 },
    { userId: 201, rank: 2, name: "Akhil", city: "Kochi", score: 790 },
    { userId: 202, rank: 3, name: "Meera", city: "Calicut", score: 760 },
    { userId: 203, rank: 4, name: "Rahul", city: "Thrissur", score: 735 },
    { userId: 204, rank: 5, name: "Nisha", city: "Kannur", score: 710 },
  ].sort((left, right) => left.rank - right.rank);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0f2545 100%)` }}
      >
        <div className="absolute right-6 top-4 opacity-10">
          <Trophy className="h-24 w-24" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-sm text-white/60">{getGreeting()},</p>
            <h1 className="mt-0.5 text-2xl font-bold text-white">{dashboard?.fullName ?? currentUser?.fullName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: `${GREEN}30`, color: GREEN }}>
                <Flame className="h-3.5 w-3.5" />
                {dashboard?.studyStreak ?? 0} day streak
              </div>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: `${GOLD}25`, color: GOLD }}>
                <Trophy className="h-3.5 w-3.5" />
                Rank #{dashboard?.rank || "-"}
              </div>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <p className="text-xs text-white/40">Current Week</p>
            <p className="mt-0.5 text-3xl font-bold" style={{ color: GREEN }}>
              W{currentWeek}
            </p>
            <p className="mt-0.5 text-xs text-white/50">Target year {dashboard?.targetYear}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span
              className="mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
              style={
                announcement.type === "Important"
                  ? { background: "#fef2f2", color: "#dc2626" }
                  : announcement.type === "Event"
                    ? { background: `${TEAL}15`, color: TEAL }
                    : { background: `${GREEN}15`, color: GREEN }
              }
            >
              {announcement.type}
            </span>
            <p className="flex-1 text-sm text-foreground">{announcement.title}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            Today's Discipline Habits
          </h2>
          <Link to="/student/habits" className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {habitCards
            ? habitCards.slice(0, 4).map((habit) => <HabitCard key={habit.id} habit={habit} />)
            : fallbackHabits.map((habit) => {
                const Icon = habit.icon;
                return (
                  <div key={habit.key} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold" style={{ color: NAVY }}>
                        {habit.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{habit.points} pts</p>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">Today's discipline score</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${disciplineScore * 100}%`, background: GREEN }} />
            </div>
            <span className="text-sm font-bold" style={{ color: NAVY }}>
              {completedHabitCount} / {totalHabitCount}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: NAVY }}>
              Current Week
            </h2>
            <button type="button" onClick={() => navigate("/student/courses")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
              Open Course <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: NAVY }}>
              W{currentWeek}
            </div>
            <div>
              <p className="font-semibold" style={{ color: NAVY }}>
                Foundation Revision Sprint
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Month 4 · Polity, Economy, Current Affairs</p>
            </div>
            <span className="ml-auto rounded-full px-2 py-1 text-xs font-semibold" style={{ background: `${TEAL}20`, color: TEAL }}>
              Active
            </span>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {["Parliament", "Fiscal Policy", "Editorial Notes", "CSAT Drill"].map((topic) => (
              <span key={topic} className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {topic}
              </span>
            ))}
          </div>

          <div className="rounded-xl border p-4" style={{ background: `${GREEN}08`, borderColor: `${GREEN}40` }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: NAVY }}>
                  Weekly Review Scheduled
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Dr. Ramesh Kumar · Saturday, 5:00 PM</p>
              </div>
              <button type="button" className="rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: GREEN }}>
                Join
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <Lock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Score needed to unlock Week {currentWeek + 1}</span>
                <span className="font-semibold" style={{ color: NAVY }}>
                  5.5 / 7.5
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full" style={{ width: "73%", background: GREEN }} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: NAVY }}>
              Leaderboard
            </h2>
            <button type="button" onClick={() => navigate("/student/leaderboard")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
              Full <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const isMe = entry.userId === dashboard?.userId;
              const rankColors = [GOLD, "#C0C0C0", "#CD7F32"];

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 rounded-xl p-2.5 ${isMe ? "border-2" : "border border-border"}`}
                  style={isMe ? { borderColor: GREEN, background: `${GREEN}08` } : undefined}
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={index < 3 ? { background: rankColors[index], color: "white" } : { background: "#e5e7eb", color: "#374151" }}
                  >
                    {entry.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold" style={{ color: NAVY }}>
                      {isMe ? "You" : entry.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{entry.city}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: isMe ? GREEN : NAVY }}>
                    {entry.score}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            My Courses
          </h2>
          <button type="button" onClick={() => navigate("/student/courses")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
            All Courses <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mockCourses.map((course, index) => {
            const gradients = [
              `linear-gradient(135deg, ${NAVY} 0%, #1a3a6e 100%)`,
              `linear-gradient(135deg, ${TEAL} 0%, #0f5a67 100%)`,
            ];

            return (
              <button
                type="button"
                key={course.id}
                onClick={() => navigate("/student/courses")}
                className="overflow-hidden rounded-xl border border-border text-left transition-shadow hover:shadow-md"
              >
                <div className="flex h-24 items-end p-4" style={{ background: gradients[index % 2] }}>
                  <div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">{course.category}</span>
                    <p className="mt-1 line-clamp-1 text-sm font-semibold leading-tight text-white">{course.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{course.instructor}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" style={{ color: GOLD }} fill={GOLD} />
                      {course.rating}
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold" style={{ color: NAVY }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: GREEN }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            Upcoming Sessions
          </h2>
          <button type="button" onClick={() => navigate("/student/sessions")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
            All Sessions <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {mockSessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${TEAL}18` }}>
                <Calendar className="h-5 w-5" style={{ color: TEAL }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                  {session.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.subject} ·{" "}
                  {new Date(session.scheduledAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${GREEN}15`, color: GREEN }}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
