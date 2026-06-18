export interface AdminProgram {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CreateProgramRequest {
  name: string;
  code: string;
}

export interface AdminSubject {
  id: number;
  programId: number;
  name: string;
  description: string;
  durationMonths: number;
  isPublished: boolean;
}

export interface CreateSubjectRequest {
  programId: number;
  name: string;
  description: string;
  durationMonths: number;
}

export interface AdminSubjectMonth {
  id: number;
  subjectId: number;
  monthNumber: number;
  title: string;
}

export interface CreateSubjectMonthRequest {
  monthNumber: number;
  title: string;
}

export interface AdminSubjectWeek {
  id: number;
  subjectMonthId: number;
  weekNumber: number;
  title: string;
}

export interface CreateSubjectWeekRequest {
  weekNumber: number;
  title: string;
}

export interface AdminSubjectDayTopic {
  id: number;
  subjectWeekId: number;
  dayNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export interface CreateSubjectDayTopicRequest {
  dayNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export interface AdminCourse {
  id: number;
  programId: number;
  title: string;
  description: string;
  durationMonths: number;
  price: number;
  status: string;
  subjectCount: number;
}

export interface CreateCourseRequest {
  programId: number;
  title: string;
  description: string;
  durationMonths: number;
  price: number;
}

export interface AttachCourseSubjectItem {
  subjectId: number;
  displayOrder: number;
  startMonth: number;
}

export interface AttachCourseSubjectsRequest {
  subjects: AttachCourseSubjectItem[];
}

export interface AdminCourseSubject {
  subjectId: number;
  subjectName: string;
  displayOrder: number;
  startMonth: number;
}

export interface AdminCourseDetails {
  id: number;
  programId: number;
  title: string;
  description: string;
  durationMonths: number;
  price: number;
  status: string;
  subjects: AdminCourseSubject[];
}