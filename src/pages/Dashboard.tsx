
import { useAuth } from "@/hooks/useAuth";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

export default Dashboard;
