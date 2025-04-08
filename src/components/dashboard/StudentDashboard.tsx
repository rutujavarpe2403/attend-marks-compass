
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { StudentDashboardData } from "./student/types";
import { fetchStudentDashboardData } from "./student/DashboardService";
import { AttendanceSummaryCard } from "./student/AttendanceSummaryCard";
import { AttendanceChartSection } from "./student/AttendanceChartSection";
import { AttendanceTabContent } from "./student/TabContent";
import { MarksTabContent } from "./student/TabContent";
import { StudentPerformanceTab } from "../students/performance/StudentPerformanceTab";
import { supabase } from "@/integrations/supabase/client";
import { MarksData } from "../students/types/student";

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [marksData, setMarksData] = useState<MarksData[]>([]);
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

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!profile?.id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchStudentDashboardData(profile.id);
        setDashboardData(data);
        
        // Fetch marks data for performance chart
        const { data: marks, error } = await supabase
          .from('marks')
          .select('*')
          .eq('student_id', profile.id);
        
        if (error) throw error;
        setMarksData(marks || []);
      } catch (error) {
        console.error("Error loading student dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { attendanceSummary, recentAttendance, recentMarks } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AttendanceSummaryCard attendanceSummary={attendanceSummary} />
      </div>
      
      <AttendanceChartSection attendanceSummary={attendanceSummary} />
      
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTabContent recentAttendance={recentAttendance} />
        </TabsContent>
        
        <TabsContent value="marks" className="space-y-4">
          <MarksTabContent recentMarks={recentMarks} />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <StudentPerformanceTab marksData={marksData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
