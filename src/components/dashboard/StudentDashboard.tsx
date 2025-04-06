
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { AttendanceChart } from "./teacher/AttendanceChart";

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
  });

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
          .eq('student_id', studentData.id);
        
        if (attendanceError) {
          console.error("Error fetching attendance data:", attendanceError);
          setIsLoading(false);
          return;
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
        
        setDashboardData({
          attendanceSummary: {
            present: totalPresent,
            absent: totalAbsent,
            percentage,
            bySlot: attendanceBySlot,
          },
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

  const { attendanceSummary } = dashboardData;

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
          <CardTitle>Attendance by Time Slot</CardTitle>
          <CardDescription>
            Your attendance distribution across different time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceChart attendanceBySlot={attendanceSummary.bySlot} />
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
              <p className="text-center text-muted-foreground py-8">
                Attendance details will be shown here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Recent marks will be shown here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
