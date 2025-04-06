
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { DataTable } from "@/components/common/DataTable";
import { BookOpen, CalendarDays, CheckCircle, Clock, FileText, Loader2, Users, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DashboardStats {
  totalStudents: number;
  attendanceRate: number;
  averageGrade: number;
  pendingReports: number;
}

interface AttendanceRecord {
  class: string;
  date: string;
  present: number;
  absent: number;
  rate: number;
}

interface MarkRecord {
  subject: string;
  class: string;
  examType: string;
  avgScore: string;
  status: "Completed" | "Pending";
}

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch total student count
      const { data: students, error: studentError } = await supabase
        .from('students')
        .select('id');
      
      if (studentError) throw studentError;
      
      // Fetch attendance data for attendance rate
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*');
      
      if (attendanceError) throw attendanceError;
      
      // Fetch marks data for average grade
      const { data: marksData, error: marksError } = await supabase
        .from('marks')
        .select('*');
      
      if (marksError) throw marksError;
      
      // Calculate dashboard stats
      const totalStudents = students?.length || 0;
      
      // Calculate attendance rate
      let totalAttendanceRecords = 0;
      let presentRecords = 0;
      
      if (attendanceData && attendanceData.length > 0) {
        totalAttendanceRecords = attendanceData.length * 3; // morning, afternoon, evening slots
        
        attendanceData.forEach(record => {
          if (record.morning) presentRecords++;
          if (record.afternoon) presentRecords++;
          if (record.evening) presentRecords++;
        });
      }
      
      const attendanceRate = totalAttendanceRecords > 0 
        ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
        : 0;
      
      // Calculate average grade
      const averageGrade = marksData && marksData.length > 0 
        ? Math.round(marksData.reduce((sum, mark) => sum + mark.marks, 0) / marksData.length) 
        : 0;
      
      setStats({
        totalStudents,
        attendanceRate,
        averageGrade,
        pendingReports: 5 // Static demo value
      });
      
      // Process recent attendance data
      if (attendanceData && attendanceData.length > 0) {
        const attendanceByDate = attendanceData.reduce((acc, record) => {
          const date = record.date;
          const classId = "Class"; // In a real app, we'd join with student data to get class
          
          if (!acc[date]) {
            acc[date] = {};
          }
          
          if (!acc[date][classId]) {
            acc[date][classId] = {
              present: 0,
              absent: 0,
              total: 0
            };
          }
          
          // Count morning, afternoon, evening separately
          acc[date][classId].total += 3; // 3 sessions per day
          if (record.morning) acc[date][classId].present += 1;
          else acc[date][classId].absent += 1;
          
          if (record.afternoon) acc[date][classId].present += 1;
          else acc[date][classId].absent += 1;
          
          if (record.evening) acc[date][classId].present += 1;
          else acc[date][classId].absent += 1;
          
          return acc;
        }, {} as Record<string, Record<string, {present: number, absent: number, total: number}>>);
        
        // Convert to array format for table
        const recentAttendance: AttendanceRecord[] = [];
        
        Object.entries(attendanceByDate).slice(0, 5).forEach(([date, classes]) => {
          Object.entries(classes).forEach(([classId, data]) => {
            recentAttendance.push({
              class: classId,
              date,
              present: data.present,
              absent: data.absent,
              rate: Math.round((data.present / data.total) * 100)
            });
          });
        });
        
        setRecentAttendanceData(recentAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      
      // Process recent marks data
      if (marksData && marksData.length > 0) {
        const marksBySubject = marksData.reduce((acc, mark) => {
          const key = `${mark.subject_id}-${mark.class_id}-${mark.exam_type}`;
          
          if (!acc[key]) {
            acc[key] = {
              subject: mark.subject_id,
              class: mark.class_id,
              examType: mark.exam_type,
              total: 0,
              count: 0,
              status: "Completed" as const
            };
          }
          
          acc[key].total += mark.marks;
          acc[key].count += 1;
          
          return acc;
        }, {} as Record<string, {subject: string, class: string, examType: string, total: number, count: number, status: "Completed" | "Pending"}>);
        
        // Convert to array format for table
        const recentMarks = Object.values(marksBySubject).map(item => ({
          subject: item.subject,
          class: item.class,
          examType: item.examType,
          avgScore: `${Math.round(item.total / item.count)}/100`,
          status: item.status
        }));
        
        setRecentMarksData(recentMarks.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const recentAttendanceColumns = [
    { header: "Class", accessorKey: "class" },
    { header: "Date", accessorKey: "date" },
    { header: "Present", accessorKey: "present" },
    { header: "Absent", accessorKey: "absent" },
    { 
      header: "Rate", 
      accessorKey: "rate",
      cell: ({ row }: { row: any }) => {
        const rate = row.original.rate;
        const colorClass = rate >= 90 ? "text-green-600" : rate >= 75 ? "text-yellow-600" : "text-red-600";
        return <span className={colorClass}>{rate}%</span>;
      }
    },
  ];

  const recentMarksColumns = [
    { header: "Subject", accessorKey: "subject" },
    { header: "Class", accessorKey: "class" },
    { header: "Exam Type", accessorKey: "examType" },
    { header: "Avg. Score", accessorKey: "avgScore" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        const icon = status === "Completed" ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-yellow-600" />
        );
        return (
          <div className="flex items-center">
            {icon}
            <span className="ml-2">{status}</span>
          </div>
        );
      }
    },
  ];

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={String(stats.totalStudents)}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend="+5%"
          trendDirection="up"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          trend="+2%"
          trendDirection="up"
        />
        <StatsCard
          title="Average Grade"
          value={stats.averageGrade > 0 ? `${stats.averageGrade}/100` : "N/A"}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          trend="+3%"
          trendDirection="up"
        />
        <StatsCard
          title="Pending Reports"
          value={String(stats.pendingReports)}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          trend="-2"
          trendDirection="down"
        />
      </div>

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
              {recentAttendanceData.length > 0 ? (
                <DataTable columns={recentAttendanceColumns} data={recentAttendanceData} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent attendance records found</p>
                </div>
              )}
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
              {recentMarksData.length > 0 ? (
                <DataTable columns={recentMarksColumns} data={recentMarksData} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent mark entries found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex items-start pb-2 border-b last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full mr-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-muted-foreground text-xs">Due: {task.due}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="h-4 w-4" />
              Absence Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {absenceAlerts.map(alert => (
                <li key={alert.id} className="flex items-start pb-2 border-b last:border-0 last:pb-0">
                  <div className="bg-destructive/10 p-2 rounded-full mr-2">
                    <Users className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.student} ({alert.class})</p>
                    <p className="text-muted-foreground text-xs">
                      {alert.days} days absent • {alert.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
