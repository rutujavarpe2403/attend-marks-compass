
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { format, subDays } from "date-fns";

export interface AttendanceSummary {
  present: number;
  absent: number;
  percentage: number;
  bySlot: {
    morning: { present: number; absent: number };
    afternoon: { present: number; absent: number };
    evening: { present: number; absent: number };
  };
}

export interface StudentDashboardData {
  attendanceSummary: AttendanceSummary;
  recentAttendance: any[];
  recentMarks: any[];
}

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<StudentDashboardData>({
    attendanceSummary: {
      present: 0,
      absent: 0,
      percentage: 0,
      bySlot: {
        morning: { present: 0, absent: 0 },
        afternoon: { present: 0, absent: 0 },
        evening: { present: 0, absent: 0 },
      },
    },
    recentAttendance: [],
    recentMarks: []
  });
  const [activeChartType, setActiveChartType] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    const fetchStudentDashboardData = async () => {
      if (!profile?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch student record to get student_id
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', profile.id)
          .single();
        
        if (studentError || !studentData) {
          console.error("Error fetching student data:", studentError);
          setIsLoading(false);
          return;
        }

        // Fetch attendance data
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', studentData.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (attendanceError) {
          console.error("Error fetching attendance data:", attendanceError);
          setIsLoading(false);
          return;
        }

        // Fetch marks data
        const { data: marksData, error: marksError } = await supabase
          .from('marks')
          .select('*')
          .eq('student_id', studentData.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (marksError) {
          console.error("Error fetching marks data:", marksError);
        }

        // Process attendance data
        const attendanceBySlot = {
          morning: { present: 0, absent: 0 },
          afternoon: { present: 0, absent: 0 },
          evening: { present: 0, absent: 0 },
        };
        
        let totalPresent = 0;
        
        if (attendanceData && attendanceData.length > 0) {
          attendanceData.forEach((record: any) => {
            // Morning slot
            if (record.morning) {
              attendanceBySlot.morning.present++;
              totalPresent++;
            } else {
              attendanceBySlot.morning.absent++;
            }
            
            // Afternoon slot
            if (record.afternoon) {
              attendanceBySlot.afternoon.present++;
              totalPresent++;
            } else {
              attendanceBySlot.afternoon.absent++;
            }
            
            // Evening slot
            if (record.evening) {
              attendanceBySlot.evening.present++;
              totalPresent++;
            } else {
              attendanceBySlot.evening.absent++;
            }
          });
        }
        
        const totalSlots = attendanceData.length * 3; // morning, afternoon, evening
        const totalAbsent = totalSlots - totalPresent;
        const percentage = totalSlots > 0 ? Math.round((totalPresent / totalSlots) * 100) : 0;
        
        // Format recent attendance for display
        const recentAttendance = (attendanceData || []).map(record => {
          const presentCount = (record.morning ? 1 : 0) + (record.afternoon ? 1 : 0) + (record.evening ? 1 : 0);
          const totalCount = 3;
          return {
            date: format(new Date(record.date), 'MMM dd, yyyy'),
            present: presentCount,
            absent: totalCount - presentCount,
            rate: Math.round((presentCount / totalCount) * 100)
          };
        });

        setDashboardData({
          attendanceSummary: {
            present: totalPresent,
            absent: totalAbsent,
            percentage,
            bySlot: attendanceBySlot,
          },
          recentAttendance,
          recentMarks: marksData || []
        });
        
      } catch (error) {
        console.error("Error loading student dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentDashboardData();
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { attendanceSummary, recentAttendance, recentMarks } = dashboardData;

  // Chart data for attendance
  const pieChartData = [
    { name: 'Present', value: attendanceSummary.present, color: '#86efac' }, // light green
    { name: 'Absent', value: attendanceSummary.absent, color: '#fca5a5' }, // light red
  ];

  // Bar chart data by slot
  const barChartData = [
    {
      name: 'Morning',
      Present: attendanceSummary.bySlot.morning.present,
      Absent: attendanceSummary.bySlot.morning.absent,
    },
    {
      name: 'Afternoon',
      Present: attendanceSummary.bySlot.afternoon.present,
      Absent: attendanceSummary.bySlot.afternoon.absent,
    },
    {
      name: 'Evening',
      Present: attendanceSummary.bySlot.evening.present,
      Absent: attendanceSummary.bySlot.evening.absent,
    },
  ];

  const AttendanceBarChart = () => (
    <div className="h-64">
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
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Overall attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary.percentage}%</div>
            <p className="text-sm text-muted-foreground">
              {attendanceSummary.present} present / {attendanceSummary.absent} absent
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>
            Your attendance distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChartType} onValueChange={(value) => setActiveChartType(value as "bar" | "pie")} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar">
              <div className="h-64">
                <AttendanceBarChart />
              </div>
            </TabsContent>
            
            <TabsContent value="pie">
              <div className="h-64">
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Present</th>
                        <th className="text-left py-2">Absent</th>
                        <th className="text-left py-2">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttendance.map((attendance, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2">{attendance.date}</td>
                          <td className="py-2">{attendance.present}</td>
                          <td className="py-2">{attendance.absent}</td>
                          <td className="py-2">
                            <span className={attendance.rate >= 90 ? 'text-green-600' : attendance.rate >= 75 ? 'text-yellow-600' : 'text-red-600'}>
                              {attendance.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent attendance records found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Marks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMarks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Subject</th>
                        <th className="text-left py-2">Class</th>
                        <th className="text-left py-2">Exam Type</th>
                        <th className="text-left py-2">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMarks.map((mark, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2">{mark.subject_id}</td>
                          <td className="py-2">{mark.class_id}</td>
                          <td className="py-2">{mark.exam_type}</td>
                          <td className="py-2">{mark.marks}/100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent marks found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
