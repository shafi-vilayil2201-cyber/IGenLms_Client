import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  FileText,
  Flame,
  Moon,
  PlayCircle,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import {
  getStudentDashboard,
  getTodayAccountability,
  getTodayFocusSessions,
  getTodayStudentHabits,
} from "../../core/student/student.api";
import type {
  StudentDailyAccountability,
  StudentFocusSession,
  StudentHabit,
} from "../../core/student/student.types";

const NAVY = "#0A1628";
const GREEN = "#009E2C";
const GOLD = "#D4A017";
const TEAL = "#1A7F8E";

const fallbackHabitDefs = [
  {
    key: "topic-study",
    label: "Topic Study",
    sub: "Watch lecture + read notes",
    icon: BookOpen,
    pts: 10,
    color: NAVY,
  },
  {
    key: "daily-quiz",
    label: "Daily Quiz",
    sub: "10-question practice quiz",
    icon: FileText,
    pts: 10,
    color: TEAL,
  },
  {
    key: "current-affairs",
    label: "Newspaper Reading",
    sub: "Mark 5+ headlines",
    icon: FileText,
    pts: 10,
    color: GREEN,
  },
  {
    key: "exercise",
    label: "Exercise",
    sub: "30+ minutes physical activity",
    icon: Dumbbell,
    pts: 10,
    color: GOLD,
  },
];

const mockHistory = [
  { id: "d1", date: "2026-05-14", score: 2.5, completed: [true, false, true, false] },
  { id: "d2", date: "2026-05-15", score: 3, completed: [true, true, true, false] },
  { id: "d3", date: "2026-05-16", score: 2, completed: [true, false, false, true] },
  { id: "d4", date: "2026-05-17", score: 3.5, completed: [true, true, true, true] },
  { id: "d5", date: "2026-05-18", score: 3, completed: [true, true, false, true] },
  { id: "d6", date: "2026-05-19", score: 2.5, completed: [false, true, true, true] },
  { id: "d7", date: "2026-05-20", score: 0, completed: [false, false, false, false] },
];

const mockAccountability = {
  date: "2026-05-20",
  plannedHours: 6,
  actualHours: 2.5,
  focusSubject: "Polity revision and current affairs notes",
  tasksPlanned: 4,
  tasksCompleted: 2,
  completionPercent: 50,
  dailyScore: 2.2,
  streakQualified: false,
  energyLevel: 4,
  nightReviewSubmitted: false,
};

const mockFocusSessions = [
  {
    id: 1,
    topic: "Parliament notes",
    plannedMinutes: 60,
    status: "completed" as const,
    startedAtUtc: "2026-05-20T04:30:00Z",
    expectedEndAtUtc: "2026-05-20T05:30:00Z",
  },
  {
    id: 2,
    topic: "Editorial analysis",
    plannedMinutes: 45,
    status: "active" as const,
    startedAtUtc: "2026-05-20T09:30:00Z",
    expectedEndAtUtc: "2026-05-20T10:15:00Z",
  },
];

const fallbackAccountability: StudentDailyAccountability = mockAccountability;
const fallbackFocusSessions: StudentFocusSession[] = mockFocusSessions;

function getHabitIcon(habitType: string) {
  const normalized = habitType.toLowerCase();
  if (normalized.includes("current")) return FileText;
  if (normalized.includes("exercise")) return Dumbbell;
  if (normalized.includes("revision")) return CheckCircle;
  return BookOpen;
}

function getHabitSubText(habit: StudentHabit) {
  if (habit.description) return habit.description;
  return `${habit.targetMinutes} minutes · ${habit.reminderTime}`;
}

export default function StudentHabitsPage() {
  const [localChecked, setLocalChecked] = useState<Record<number, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: getStudentDashboard,
  });

  const habitsQuery = useQuery({
    queryKey: ["student-habits-today"],
    queryFn: getTodayStudentHabits,
  });

  const accountabilityQuery = useQuery({
    queryKey: ["student-accountability-today"],
    queryFn: getTodayAccountability,
  });

  const focusSessionsQuery = useQuery({
    queryKey: ["student-focus-sessions-today"],
    queryFn: getTodayFocusSessions,
  });

  const habits = habitsQuery.data ?? [];
  const accountability = accountabilityQuery.data ?? fallbackAccountability;
  const focusSessions = focusSessionsQuery.data ?? fallbackFocusSessions;
  const displayedHabits = habits.length > 0 ? habits : null;

  const checkedCount = useMemo(() => {
    if (!displayedHabits) {
      return 0;
    }

    return displayedHabits.filter((habit) => localChecked[habit.id] ?? habit.isCompletedToday).length;
  }, [displayedHabits, localChecked]);

  const totalCount = displayedHabits?.length ?? fallbackHabitDefs.length;
  const totalPoints = displayedHabits?.reduce((sum, habit) => sum + habit.points, 0) ?? 40;
  const todayScore = displayedHabits
    ? displayedHabits.reduce((sum, habit) => {
        const done = localChecked[habit.id] ?? habit.isCompletedToday;
        return done ? sum + habit.points : sum;
      }, 0)
    : 0;
  const todayDisciplineScore = totalPoints > 0 ? (todayScore / totalPoints) * 4 : 0;
  const blendedDailyScore = Number(
    Math.min(4, Math.max(accountability.dailyScore, todayDisciplineScore)).toFixed(1),
  );
  const projectedActualHours = Math.max(accountability.actualHours, Number((todayScore / 60).toFixed(1)));
  const streakQualified = checkedCount >= Math.ceil(totalCount * 0.75) && blendedDailyScore >= 3;
  const history = mockHistory.map((row, index) =>
    index === mockHistory.length - 1 ? { ...row, score: blendedDailyScore } : row,
  );

  function toggleHabit(habitId: number) {
    setStatusMessage(null);
    setLocalChecked((current) => ({
      ...current,
      [habitId]: !(current[habitId] ?? habits.find((habit) => habit.id === habitId)?.isCompletedToday ?? false),
    }));
  }

  function handleSubmit() {
    setStatusMessage(
      `Saved locally for now. Backend complete-habit API is pending. Discipline score: ${todayDisciplineScore.toFixed(1)} / 4`,
    );
  }

  if (dashboardQuery.isLoading || habitsQuery.isLoading || accountabilityQuery.isLoading || focusSessionsQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        Unable to load daily accountability.
      </div>
    );
  }

  const fallbackNotes = [
    accountabilityQuery.isError ? "Morning plan is using fallback data." : null,
    focusSessionsQuery.isError ? "Focus sessions are using fallback data." : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
          Daily Accountability
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Morning plan, habits, focus sessions, and night review in one discipline loop.
        </p>
        {fallbackNotes.length > 0 && (
          <p className="mt-2 text-xs text-amber-700">
            {fallbackNotes.join(" ")}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Flame, label: "Current Streak", val: `${dashboardQuery.data?.studyStreak ?? 0} days`, color: GREEN },
          { icon: TrendingUp, label: "Today's Points", val: `${todayScore} / ${totalPoints} pts`, color: TEAL },
          { icon: Award, label: "Daily Score", val: `${blendedDailyScore.toFixed(1)} / 4`, color: GOLD },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 text-center">
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${stat.color}18` }}
              >
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>
                {stat.val}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold" style={{ color: NAVY }}>
                Morning Plan
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {accountabilityQuery.isError ? "Fallback data is shown until the API is connected." : "Loaded from today&apos;s accountability API."}
              </p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `${GREEN}15`, color: GREEN }}>
              AM check-in
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" /> Planned
              </div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>{accountability.plannedHours}h</p>
              <p className="text-xs text-muted-foreground">target study time</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Zap className="h-4 w-4" /> Actual
              </div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>{projectedActualHours}h</p>
              <p className="text-xs text-muted-foreground">logged/projected</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4" /> Tasks
              </div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>
                {Math.max(accountability.tasksCompleted, checkedCount)} / {Math.max(accountability.tasksPlanned, totalCount)}
              </p>
              <p className="text-xs text-muted-foreground">completed today</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary focus</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: NAVY }}>{accountability.focusSubject}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((projectedActualHours / accountability.plannedHours) * 100, 100)}%`,
                  background: GREEN,
                }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>Streak Qualification</h2>
          <div className="mt-5 flex items-center justify-center">
            <div
              className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-8"
              style={{ borderColor: streakQualified ? GREEN : "#e5e7eb" }}
            >
              <span className="text-2xl font-bold" style={{ color: streakQualified ? GREEN : NAVY }}>
                {streakQualified ? "Yes" : "No"}
              </span>
              <span className="text-xs text-muted-foreground">qualified</span>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Needs 75% habits complete and daily score above 3.0.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            Today's Habits -{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h2>
          <div className="text-xs text-muted-foreground">
            {checkedCount}/{totalCount} completed
          </div>
        </div>

        <div className="mb-6 space-y-3">
          {displayedHabits
            ? displayedHabits.map((habit) => {
                const done = localChecked[habit.id] ?? habit.isCompletedToday;
                const Icon = getHabitIcon(habit.habitType);

                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    className={`flex w-full select-none items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      done ? "border-green-200 bg-green-50" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: done ? "#22c55e" : `${GREEN}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: done ? "white" : GREEN }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>
                        {habit.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{getHabitSubText(habit)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: done ? "#16a34a" : "#9ca3af" }}>
                        +{habit.points} pts
                      </span>
                      {done ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                      )}
                    </div>
                  </button>
                );
              })
            : fallbackHabitDefs.map((habit) => {
                const Icon = habit.icon;

                return (
                  <div key={habit.key} className="flex items-center gap-4 rounded-xl border border-border p-4">
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${habit.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: habit.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>
                        {habit.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{habit.sub}</p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">+{habit.pts} pts</span>
                  </div>
                );
              })}
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: NAVY }}>
              Discipline Score
            </p>
            <p className="text-xs text-muted-foreground">
              Contributes {todayDisciplineScore.toFixed(2)} pts to the daily accountability score
            </p>
            {statusMessage && <p className="mt-2 text-xs font-medium text-green-600">{statusMessage}</p>}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: GREEN }}
          >
            Save Today's Habits
          </button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold" style={{ color: NAVY }}>Focus Sessions</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {focusSessionsQuery.isError ? "Fallback focus sessions are shown." : "Loaded from today&apos;s focus-session API."}
              </p>
            </div>
            <PlayCircle className="h-5 w-5" style={{ color: GREEN }} />
          </div>
          <div className="space-y-3">
            {focusSessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>{session.topic}</p>
                    <p className="text-xs text-muted-foreground">{session.plannedMinutes} minutes planned</p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={
                      session.status === "completed"
                        ? { background: "#dcfce7", color: "#16a34a" }
                        : { background: `${TEAL}18`, color: TEAL }
                    }
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold" style={{ color: NAVY }}>Night Review</h2>
              <p className="mt-1 text-xs text-muted-foreground">Will connect to night review API later.</p>
            </div>
            <Moon className="h-5 w-5" style={{ color: TEAL }} />
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold" style={{ color: NAVY }}>
              {accountability.nightReviewSubmitted ? "Submitted" : "Pending review"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Capture completed tasks, blocker, tomorrow's first action, and productivity score.
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl px-4 py-2 text-xs font-semibold text-white"
              style={{ background: TEAL }}
            >
              Start Night Review
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-base font-bold" style={{ color: NAVY }}>
          7-Day Accountability History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                {fallbackHabitDefs.map((habit) => (
                  <th key={habit.key} className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                    {habit.label.split(" ")[0]}
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {new Date(row.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  {row.completed.map((done, index) => (
                    <td key={`${row.id}-${index}`} className="px-3 py-2.5 text-center">
                      {done ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="text-xs font-bold"
                      style={{ color: row.score >= 3 ? "#16a34a" : row.score >= 2 ? GOLD : "#dc2626" }}
                    >
                      {row.score}/4
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-base font-bold" style={{ color: NAVY }}>
          Accountability Score Trend
        </h2>
        <div className="flex h-56 items-end gap-3 rounded-xl border border-border bg-muted/20 p-4">
          {history.map((row) => (
            <div key={row.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-md"
                  style={{
                    height: `${Math.max((row.score / 4) * 100, 4)}%`,
                    background: GREEN,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
