import {apiGet} from "../api/apiClient";

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