
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define proper interface for attendance records
interface AttendanceRecord {
  date: string;
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  [key: string]: any;
}

interface MarksRecord {
  subject_id: string;
  marks: number;
  exam_type: string;
  student_id?: string;
}

const Reports = () => {
  const { profile } = useAuth();
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    summary: { present: 0, absent: 0, percentage: 0 },
    byDate: [] as { date: string; present: number; absent: number; total: number }[],
  });
  const [marksData, setMarksData] = useState({
    bySubject: [] as { subject: string; average: number }[],
    byExamType: [] as { name: string; value: number; color: string }[]
  });
  
  useEffect(() => {
    if (reportType === "attendance") {
      fetchAttendanceData(period);
    } else if (reportType === "marks") {
      fetchMarksData(period);
    }
  }, [reportType, period]);

  const fetchAttendanceData = async (timePeriod: string) => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected period
      const today = new Date();
      let fromDate;
      let toDate = today;
      
      switch (timePeriod) {
        case "weekly":
          fromDate = startOfWeek(today);
          toDate = endOfWeek(today);
          break;
        case "monthly":
          fromDate = startOfMonth(today);
          toDate = endOfMonth(today);
          break;
        case "yearly":
          fromDate = new Date(today.getFullYear(), 0, 1);
          toDate = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          fromDate = subDays(today, 30);
          break;
      }
      
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .gte("date", format(fromDate, "yyyy-MM-dd"))
        .lte("date", format(toDate, "yyyy-MM-dd"));
        
      if (error) throw error;
      
      if (data) {
        // Process attendance data
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalSessions = 0;
        
        // Aggregate attendance by date
        const byDate = (data as AttendanceRecord[]).reduce((acc, record) => {
          const date = record.date;
          
          if (!acc[date]) {
            acc[date] = {
              date,
              present: 0,
              absent: 0,
              total: 0,
            };
          }
          
          // Each record has morning, afternoon, evening sessions
          const sessions = ['morning', 'afternoon', 'evening'];
          sessions.forEach(session => {
            acc[date].total += 1;
            totalSessions += 1;
            
            if (record[session]) {
              acc[date].present += 1;
              totalPresent += 1;
            } else {
              acc[date].absent += 1;
              totalAbsent += 1;
            }
          });
          
          return acc;
        }, {} as Record<string, { date: string; present: number; absent: number; total: number }>);
        
        const byDateArray = Object.values(byDate).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setAttendanceData({
          summary: {
            present: totalPresent,
            absent: totalAbsent,
            percentage: totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0,
          },
          byDate: byDateArray,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarksData = async (timePeriod: string) => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected period
      const today = new Date();
      let fromDate;
      let toDate = today;
      
      switch (timePeriod) {
        case "weekly":
          fromDate = startOfWeek(today);
          toDate = endOfWeek(today);
          break;
        case "monthly":
          fromDate = startOfMonth(today);
          toDate = endOfMonth(today);
          break;
        case "yearly":
          fromDate = new Date(today.getFullYear(), 0, 1);
          toDate = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          fromDate = subDays(today, 30);
          break;
      }
      
      const { data, error } = await supabase
        .from("marks")
        .select("*")
        .gte("created_at", format(fromDate, "yyyy-MM-dd"))
        .lte("created_at", format(toDate, "yyyy-MM-dd"));
        
      if (error) throw error;
      
      if (data) {
        // Process marks data by subject
        const subjectMap = {} as Record<string, { total: number; count: number }>;
        const examTypeMap = {} as Record<string, number>;
        
        (data as MarksRecord[]).forEach(record => {
          // Process by subject
          if (!subjectMap[record.subject_id]) {
            subjectMap[record.subject_id] = { total: 0, count: 0 };
          }
          subjectMap[record.subject_id].total += record.marks;
          subjectMap[record.subject_id].count += 1;
          
          // Process by exam type
          if (!examTypeMap[record.exam_type]) {
            examTypeMap[record.exam_type] = 0;
          }
          examTypeMap[record.exam_type] += 1;
        });
        
        // Convert to array format for charts
        const bySubject = Object.entries(subjectMap).map(([subject, data]) => ({
          subject,
          average: Math.round(data.total / data.count),
        }));
        
        // Define colors for pie chart
        const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
        
        const byExamType = Object.entries(examTypeMap).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        }));
        
        setMarksData({
          bySubject,
          byExamType,
        });
      }
    } catch (error) {
      console.error("Error fetching marks data:", error);
      toast.error("Failed to fetch marks data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateReport = () => {
    if (reportType === "attendance") {
      fetchAttendanceData(period);
    } else if (reportType === "marks") {
      fetchMarksData(period);
    }
    toast.success(`Generated ${reportType} report for ${period} period`);
  };

  const handleDownloadReport = () => {
    let csvContent = "";
    let filename = "";
    
    if (reportType === "attendance") {
      // Create attendance CSV
      csvContent = "Date,Present,Absent,Total\n";
      attendanceData.byDate.forEach(day => {
        csvContent += `${day.date},${day.present},${day.absent},${day.total}\n`;
      });
      filename = `attendance_report_${period}_${format(new Date(), 'yyyyMMdd')}.csv`;
    } else {
      // Create marks CSV
      csvContent = "Subject,Average Marks\n";
      marksData.bySubject.forEach(subject => {
        csvContent += `${subject.subject},${subject.average}\n`;
      });
      filename = `marks_report_${period}_${format(new Date(), 'yyyyMMdd')}.csv`;
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`Downloaded ${reportType} report`);
  };

  // Pie chart data for attendance summary - using lighter colors
  const pieChartData = [
    { name: "Present", value: attendanceData.summary.present, color: "#86efac" }, // light green
    { name: "Absent", value: attendanceData.summary.absent, color: "#fca5a5" }, // light red
  ];
  
  // Bar chart data for attendance by date
  const barChartData = attendanceData.byDate.map(item => ({
    date: format(new Date(item.date), "MMM dd"),
    present: item.present,
    absent: item.absent,
  }));

  const isTeacher = profile?.role === "teacher";
  
  if (!isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Reports are only available for teachers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and analyze attendance and marks reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
            <CardDescription>
              Generate various reports based on your requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="type">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="marks">Marks Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="period">
                Time Period
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "attendance" ? "Attendance Summary" : "Marks Summary"}
            </CardTitle>
            <CardDescription>
              {reportType === "attendance" 
                ? `${period.charAt(0).toUpperCase() + period.slice(1)} attendance summary`
                : `${period.charAt(0).toUpperCase() + period.slice(1)} marks summary`}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reportType === "attendance" ? (
              <Tabs defaultValue="pie" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
                  <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pie">
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">Attendance Rate: {attendanceData.summary.percentage}%</p>
                    <p className="text-sm text-muted-foreground">
                      {attendanceData.summary.present} sessions present, {attendanceData.summary.absent} sessions absent
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="bar">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" name="Present" fill="#86efac" /> {/* light green */}
                        <Bar dataKey="absent" name="Absent" fill="#fca5a5" /> {/* light red */}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Tabs defaultValue="bar" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
                  <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bar">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={marksData.bySubject}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Average Marks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="pie">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marksData.byExamType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {marksData.byExamType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Distribution of exam types
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={handleDownloadReport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
