
import { useAuth } from "@/hooks/auth";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return profile?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

export default Dashboard;
