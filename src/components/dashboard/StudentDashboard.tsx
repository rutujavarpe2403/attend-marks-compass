import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { 
  BookOpen,
  CalendarDays, 
  CheckCircle, 
  Loader2,
  XCircle 
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

type AttendanceSummary = {
  present: number;
  absent: number;
  percentage: number;
};

type MarksData = {
  subject: string;
  marks: number;
  total: number;
  percentage: number;
};

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [marksData, setMarksData] = useState<MarksData[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch attendance data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")
          .eq("student_id", user.id)
          .gte("date", format(thirtyDaysAgo, "yyyy-MM-dd"));
        
        if (attendanceError) throw attendanceError;
        
        let presentCount = 0;
        let totalDays = 0;
        
        if (attendanceData && attendanceData.length > 0) {
          totalDays = attendanceData.length;
          
          presentCount = attendanceData.filter(day => 
            day.morning || day.afternoon || day.evening
          ).length;
        }
        
        setAttendanceSummary({
          present: presentCount,
          absent: totalDays - presentCount,
          percentage: totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0,
        });
        
        // Fetch marks data
        const { data: marksData, error: marksError } = await supabase
          .from("marks")
          .select("*")
          .eq("student_id", user.id);
          
        if (marksError) throw marksError;
        
        // Process marks data
        if (marksData && marksData.length > 0) {
          const subjectMarks: Record<string, { marks: number, count: number }> = {};
          
          marksData.forEach(mark => {
            if (!subjectMarks[mark.subject_id]) {
              subjectMarks[mark.subject_id] = { marks: 0, count: 0 };
            }
            
            subjectMarks[mark.subject_id].marks += mark.marks;
            subjectMarks[mark.subject_id].count += 1;
          });
          
          const processedMarks = Object.entries(subjectMarks).map(([subject, data]) => {
            const avgMarks = Math.round(data.marks / data.count);
            return {
              subject,
              marks: avgMarks,
              total: 100, // Assuming marks are out of 100
              percentage: avgMarks,
            };
          });
          
          setMarksData(processedMarks);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Attendance pie chart data
  const attendancePieData = [
    { name: 'Present', value: attendanceSummary.present, color: '#10b981' },
    { name: 'Absent', value: attendanceSummary.absent, color: '#ef4444' },
  ];

  // Marks bar chart data
  const marksBarData = marksData.map(item => ({
    subject: item.subject,
    marks: item.marks,
  }));

  // Marks chart configuration
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceSummary.percentage}%`}
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          trend={`${attendanceSummary.present} days present`}
          trendDirection="neutral"
        />
        <StatsCard
          title="Classes Missed"
          value={`${attendanceSummary.absent}`}
          icon={<XCircle className="h-4 w-4 text-muted-foreground" />}
          trend={`Last 30 days`}
          trendDirection="neutral"
        />
        <StatsCard
          title="Average Marks"
          value={marksData.length > 0 
            ? `${Math.round(marksData.reduce((acc, curr) => acc + curr.marks, 0) / marksData.length)}%` 
            : "N/A"}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          trend="All subjects"
          trendDirection="neutral"
        />
        <StatsCard
          title="Subjects"
          value={`${marksData.length}`}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          trend="With recorded marks"
          trendDirection="neutral"
        />
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Academic Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                Your attendance summary for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{ present: { color: '#10b981' }, absent: { color: '#ef4444' } }}>
                  <PieChart>
                    <Pie
                      data={attendancePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {attendancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                Your marks across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={marksBarData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="marks" name="Marks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest academic activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No recent activities to display.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
