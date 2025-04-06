
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { fetchDashboardData, DashboardStats } from "./teacher/DashboardData";
import { StatsSection } from "./teacher/StatsSection";
import { AttendanceSection, AttendanceRecord } from "./teacher/AttendanceSection";
import { MarksSection, MarkRecord } from "./teacher/MarksSection";
import { TasksSection } from "./teacher/TasksSection";
import { AbsenceAlertsSection } from "./teacher/AbsenceAlertsSection";

export const TeacherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    attendanceRate: 0,
    averageGrade: 0,
    pendingReports: 5, // Default value for demo
  });
  const [recentAttendanceData, setRecentAttendanceData] = useState<AttendanceRecord[]>([]);
  const [recentMarksData, setRecentMarksData] = useState<MarkRecord[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setStats(data.stats);
        setRecentAttendanceData(data.recentAttendanceData);
        setRecentMarksData(data.recentMarksData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const upcomingTasks = [
    { id: 1, title: "Grade 10A Chemistry Final", due: "Tomorrow" },
    { id: 2, title: "Submit 11C Progress Reports", due: "2 days" },
    { id: 3, title: "Parent-Teacher Meeting", due: "Next Week" },
    { id: 4, title: "Prepare Quiz for 9B", due: "Next Week" },
  ];

  const absenceAlerts = [
    { id: 1, student: "Alex Chen", class: "10A", days: 3, status: "Contacted Parents" },
    { id: 2, student: "Sarah Johnson", class: "11C", days: 2, status: "Needs Action" },
    { id: 3, student: "Mike Wilson", class: "9B", days: 4, status: "Meeting Scheduled" },
  ];

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

      <Tabs defaultValue="attendance" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Recent Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="marks" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Recent Marks</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>
                Overview of the most recent attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceSection recentAttendanceData={recentAttendanceData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Mark Entries</CardTitle>
              <CardDescription>
                Overview of the most recent mark entries and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarksSection recentMarksData={recentMarksData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <TasksSection tasks={upcomingTasks} />
        <AbsenceAlertsSection alerts={absenceAlerts} />
      </div>
    </div>
  );
};
