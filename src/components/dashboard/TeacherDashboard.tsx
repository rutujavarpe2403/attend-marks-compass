
import { Loader2 } from "lucide-react";
import { StatsSection } from "./teacher/StatsSection";
import { AttendanceTimeSlotCard } from "./teacher/AttendanceTimeSlotCard";
import { RecentAttendanceCard } from "./teacher/RecentAttendanceCard";
import { DashboardTabs } from "./teacher/DashboardTabs";
import { useDashboardData } from "./teacher/useDashboardData";

export const TeacherDashboard = () => {
  const { isLoading, stats, recentAttendanceData, recentMarksData, attendanceBySlot } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceTimeSlotCard attendanceBySlot={attendanceBySlot} />
        <RecentAttendanceCard recentAttendanceData={recentAttendanceData} />
      </div>

      <DashboardTabs 
        recentAttendanceData={recentAttendanceData} 
        recentMarksData={recentMarksData} 
      />
    </div>
  );
};
