export interface StudentHabit {
  id: number;
  title: string;
  description?: string | null;
  habitType: string;
  reminderTime: string;
  isReminderEnabled: boolean;
  isActive: boolean;
  targetMinutes: number;
  points: number;
  isCompletedToday: boolean;
  completedMinutesToday: number;
}

export interface CreateStudentHabitRequest {
  title: string;
  description?: string;
  habitType: string;
  reminderTime: string;
  isReminderEnabled: boolean;
  targetMinutes: number;
  points: number;
}

export interface StudentDailyAccountability {
  date: string;
  plannedHours: number;
  actualHours: number;
  focusSubject: string;
  tasksPlanned: number;
  tasksCompleted: number;
  completionPercent: number;
  dailyScore: number;
  streakQualified: boolean;
  energyLevel?: number;
  nightReviewSubmitted: boolean;
}

export interface StudentFocusSession {
  id: number;
  topic: string;
  plannedMinutes: number;
  status: "active" | "completed" | "cancelled";
  startedAtUtc: string;
  expectedEndAtUtc: string;
}
