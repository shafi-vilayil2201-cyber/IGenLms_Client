import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "../../core/student/student.api";

export default function StudentPage() {
  const dashboardQuery = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: getStudentDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <p>Loading student dashboard...</p>;
  }

  if (dashboardQuery.isError) {
    return <p>Unable to load student dashboard.</p>;
  }

  const dashboard = dashboardQuery.data;

  return (
    <section>
      <h1>Welcome, {dashboard?.fullName}</h1>
      <p>Email: {dashboard?.email}</p>
      <p>Target Year: {dashboard?.targetYear}</p>
      <p>Study Streak: {dashboard?.studyStreak}</p>
      <p>Rank: {dashboard?.rank}</p>
      <p>Enrolled Courses: {dashboard?.enrolledCoursesCount}</p>
    </section>
  );
}
