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
