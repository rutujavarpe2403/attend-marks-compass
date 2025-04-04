
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { CalendarDays, BookOpen, Clock, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";

export const StudentDashboard = () => {
  // In a real app, these would come from API calls
  const stats = [
    {
      title: "Attendance Rate",
      value: "95%",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      trend: "+2%",
      trendDirection: "up",
    },
    {
      title: "Average Grade",
      value: "A-",
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
      trend: "+3",
      trendDirection: "up",
    },
    {
      title: "Assignments Due",
      value: "3",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      trend: "-1",
      trendDirection: "down",
    },
    {
      title: "Absences",
      value: "2",
      icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
      trend: "0",
      trendDirection: "neutral",
    },
  ];

  const recentAttendanceColumns = [
    { header: "Subject", accessorKey: "subject" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        const statusClass = status === "Present" 
          ? "text-green-600 bg-green-50 border-green-100" 
          : status === "Absent" 
            ? "text-red-600 bg-red-50 border-red-100" 
            : "text-yellow-600 bg-yellow-50 border-yellow-100";
        
        return (
          <span className={`text-xs px-2 py-1 rounded-full border ${statusClass}`}>
            {status}
          </span>
        );
      }
    },
  ];

  const recentMarksColumns = [
    { header: "Subject", accessorKey: "subject" },
    { header: "Exam Type", accessorKey: "examType" },
    { header: "Date", accessorKey: "date" },
    { header: "Score", accessorKey: "score" },
    { 
      header: "Grade", 
      accessorKey: "grade",
      cell: ({ row }: { row: any }) => {
        const grade = row.original.grade;
        const gradeClass = 
          grade === "A" || grade === "A-" ? "text-green-600" :
          grade === "B+" || grade === "B" ? "text-blue-600" :
          grade === "B-" || grade === "C+" ? "text-yellow-600" :
          "text-red-600";
        
        return <span className={`font-medium ${gradeClass}`}>{grade}</span>;
      }
    },
  ];

  const recentAttendanceData = [
    { subject: "Mathematics", date: "2025-04-04", status: "Present" },
    { subject: "Physics", date: "2025-04-04", status: "Present" },
    { subject: "English", date: "2025-04-03", status: "Late" },
    { subject: "Chemistry", date: "2025-04-03", status: "Present" },
    { subject: "History", date: "2025-04-02", status: "Absent" },
  ];

  const recentMarksData = [
    { subject: "Mathematics", examType: "Midterm", date: "2025-03-15", score: "92/100", grade: "A" },
    { subject: "Physics", examType: "Quiz", date: "2025-03-22", score: "85/100", grade: "B+" },
    { subject: "English", examType: "Essay", date: "2025-03-18", score: "88/100", grade: "B+" },
    { subject: "Chemistry", examType: "Lab Report", date: "2025-03-25", score: "95/100", grade: "A" },
    { subject: "History", examType: "Project", date: "2025-03-10", score: "78/100", grade: "C+" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Physics Lab Report", due: "Tomorrow", subject: "Physics" },
    { id: 2, title: "English Essay", due: "3 days", subject: "English" },
    { id: 3, title: "Math Problem Set", due: "Next Week", subject: "Mathematics" },
  ];

  const subjectPerformance = [
    { subject: "Mathematics", progress: 92 },
    { subject: "Physics", progress: 85 },
    { subject: "English", progress: 88 },
    { subject: "Chemistry", progress: 95 },
    { subject: "History", progress: 78 },
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
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>
                Your attendance records for the past week
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
              <CardTitle>Recent Marks</CardTitle>
              <CardDescription>
                Your most recent exam and assignment scores
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
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length > 0 ? (
              <ul className="space-y-4">
                {upcomingAssignments.map(assignment => (
                  <li key={assignment.id} className="flex items-start pb-2 border-b last:border-0 last:pb-0">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{assignment.title}</p>
                      <p className="text-muted-foreground text-xs">
                        Due: {assignment.due} • {assignment.subject}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">All caught up!</h3>
                <p className="text-xs text-muted-foreground">
                  You don't have any upcoming assignments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <li key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{subject.subject}</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
