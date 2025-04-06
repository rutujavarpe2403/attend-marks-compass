
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

const Reports = () => {
  const { profile } = useAuth();
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    summary: { present: 0, absent: 0, percentage: 0 },
    byDate: [] as { date: string; present: number; absent: number; total: number }[],
  });
  
  useEffect(() => {
    if (reportType === "attendance") {
      fetchAttendanceData(period);
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
        const byDate = data.reduce((acc, record) => {
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
  
  const handleGenerateReport = () => {
    toast.success(`Generated ${reportType} report for ${period} period`);
  };

  const handleDownloadReport = () => {
    toast.success(`Downloaded ${reportType} report`);
  };

  // Pie chart data for attendance summary
  const pieChartData = [
    { name: "Present", value: attendanceData.summary.present, color: "#10b981" },
    { name: "Absent", value: attendanceData.summary.absent, color: "#ef4444" },
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
                        <Bar dataKey="present" name="Present" fill="#10b981" />
                        <Bar dataKey="absent" name="Absent" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground">Marks report is not yet available</p>
              </div>
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
