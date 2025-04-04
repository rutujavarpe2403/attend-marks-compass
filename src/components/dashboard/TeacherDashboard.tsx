
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { DataTable } from "@/components/common/DataTable";
import { BookOpen, CalendarDays, CheckCircle, Clock, FileText, Users, XCircle } from "lucide-react";

export const TeacherDashboard = () => {
  // In a real app, these would come from API calls
  const stats = [
    {
      title: "Total Students",
      value: "240",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: "+5%",
      trendDirection: "up",
    },
    {
      title: "Attendance Rate",
      value: "92%",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      trend: "+2%",
      trendDirection: "up",
    },
    {
      title: "Average Grade",
      value: "B+",
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
      trend: "+3%",
      trendDirection: "up",
    },
    {
      title: "Pending Reports",
      value: "5",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      trend: "-2",
      trendDirection: "down",
    },
  ];

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

  const recentAttendanceData = [
    { class: "10A", date: "2025-04-04", present: 28, absent: 2, rate: 93 },
    { class: "9B", date: "2025-04-04", present: 25, absent: 5, rate: 83 },
    { class: "11C", date: "2025-04-03", present: 30, absent: 0, rate: 100 },
    { class: "12A", date: "2025-04-03", present: 24, absent: 6, rate: 80 },
    { class: "10B", date: "2025-04-02", present: 27, absent: 3, rate: 90 },
  ];

  const recentMarksData = [
    { subject: "Mathematics", class: "10A", examType: "Midterm", avgScore: "85/100", status: "Completed" },
    { subject: "Physics", class: "11C", examType: "Assignment", avgScore: "74/100", status: "Completed" },
    { subject: "English", class: "12A", examType: "Quiz", avgScore: "90/100", status: "Completed" },
    { subject: "Chemistry", class: "10B", examType: "Final", avgScore: "-", status: "Pending" },
    { subject: "Biology", class: "9B", examType: "Project", avgScore: "-", status: "Pending" },
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendDirection={stat.trendDirection as "up" | "down" | "neutral"}
          />
        ))}
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
              <DataTable columns={recentAttendanceColumns} data={recentAttendanceData} />
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
              <DataTable columns={recentMarksColumns} data={recentMarksData} />
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
