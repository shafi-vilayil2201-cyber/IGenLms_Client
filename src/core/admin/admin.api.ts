import { apiGet, apiPost } from "../api/apiClient";
import type {
  AdminCourse,
  AdminCourseDetails,
  AdminProgram,
  AdminSubject,
  AdminSubjectDayTopic,
  AdminSubjectMonth,
  AdminSubjectWeek,
  AttachCourseSubjectsRequest,
  CreateCourseRequest,
  CreateProgramRequest,
  CreateSubjectDayTopicRequest,
  CreateSubjectMonthRequest,
  CreateSubjectRequest,
  CreateSubjectWeekRequest,
} from "./admin.types";

export function getAdminPrograms() {
  return apiGet<AdminProgram[]>("/api/admin/programs");
}

export function createAdminProgram(payload: CreateProgramRequest) {
  return apiPost<AdminProgram>("/api/admin/programs", payload);
}

export function getAdminSubjects(programId: number) {
  return apiGet<AdminSubject[]>(`/api/admin/subjects?programId=${programId}`);
}

export function createAdminSubject(payload: CreateSubjectRequest) {
  return apiPost<AdminSubject>("/api/admin/subjects", payload);
}

export function createSubjectMonth(subjectId: number, payload: CreateSubjectMonthRequest) {
  return apiPost<AdminSubjectMonth>(`/api/admin/subjects/${subjectId}/months`, payload);
}

export function createSubjectWeek(monthId: number, payload: CreateSubjectWeekRequest) {
  return apiPost<AdminSubjectWeek>(`/api/admin/subject-months/${monthId}/weeks`, payload);
}

export function createSubjectDayTopic(weekId: number, payload: CreateSubjectDayTopicRequest) {
  return apiPost<AdminSubjectDayTopic>(`/api/admin/subject-weeks/${weekId}/day-topics`, payload);
}

export function getAdminCourses(programId: number) {
  return apiGet<AdminCourse[]>(`/api/admin/courses?programId=${programId}`);
}

export function createAdminCourse(payload: CreateCourseRequest) {
  return apiPost<AdminCourse>("/api/admin/courses", payload);
}

export function getAdminCourseDetails(courseId: number) {
  return apiGet<AdminCourseDetails>(`/api/admin/courses/${courseId}`);
}

export function attachCourseSubjects(courseId: number, payload: AttachCourseSubjectsRequest) {
  return apiPost<AdminCourseDetails>(`/api/admin/courses/${courseId}/subjects`, payload);
}