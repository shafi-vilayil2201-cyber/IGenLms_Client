import { apiGet, apiPost } from "../api/apiClient";
import type { CreateStudentHabitRequest, StudentHabit } from "./student.types";

export interface studentDashboardResponse{
    userId:number;
    fullName:string;
    email:string;
    targetYear:number;
    studyStreak:number;
    rank:number;
    enrolledCoursesCount:number;
}

export function getStudentDashboard(){
    return apiGet<studentDashboardResponse>("/api/Student/dashboard");
}

export function getTodayStudentHabits() {
    return apiGet<StudentHabit[]>("/api/student/habits/today");
}

export function createStudentHabit(payload: CreateStudentHabitRequest) {
    return apiPost<StudentHabit>("/api/student/habits", payload);
}
