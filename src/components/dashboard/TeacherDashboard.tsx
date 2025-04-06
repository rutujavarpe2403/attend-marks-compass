
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { fetchDashboardData, DashboardStats } from "./teacher/DashboardData";
import { StatsSection } from "./teacher/StatsSection";
import { AttendanceSection, AttendanceRecord } from "./teacher/AttendanceSection";
import { MarksSection, MarkRecord } from "./teacher/MarksSection";
import { AttendanceChart } from "./teacher/AttendanceChart";

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
  const [attendanceBySlot, setAttendanceBySlot] = useState({
    morning: { present: 0, absent: 0 },
    afternoon: { present: 0, absent: 0 },
    evening: { present: 0, absent: 0 },
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setStats(data.stats);
        setRecentAttendanceData(data.recentAttendanceData);
        setRecentMarksData(data.recentMarksData);
        setAttendanceBySlot(data.attendanceBySlot);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance by Time Slot</CardTitle>
            <CardDescription>
              Distribution of attendance across different time slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart attendanceBySlot={attendanceBySlot} />
          </CardContent>
        </Card>

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
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Attendance Details</span>
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
              <CardTitle>Detailed Attendance Records</CardTitle>
              <CardDescription>
                Complete overview of attendance records
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
    </div>
  );
};
