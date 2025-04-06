
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AttendanceRecord } from "./AttendanceSection";
import { MarkRecord } from "./MarksSection";

export interface DashboardStats {
  totalStudents: number;
  attendanceRate: number;
  averageGrade: number;
  pendingReports: number;
}

export const fetchDashboardData = async () => {
  try {
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
      
      attendanceData.forEach((record: any) => {
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
      ? Math.round(marksData.reduce((sum: number, mark: any) => sum + mark.marks, 0) / marksData.length) 
      : 0;
    
    const stats: DashboardStats = {
      totalStudents,
      attendanceRate,
      averageGrade,
      pendingReports: 5 // Static demo value
    };
    
    // Process recent attendance data
    let recentAttendanceData: AttendanceRecord[] = [];
    
    if (attendanceData && attendanceData.length > 0) {
      const attendanceByDate: Record<string, Record<string, {present: number, absent: number, total: number}>> = {};
      
      attendanceData.forEach((record: any) => {
        const date = record.date;
        const classId = "Class"; // In a real app, we'd join with student data to get class
        
        if (!attendanceByDate[date]) {
          attendanceByDate[date] = {};
        }
        
        if (!attendanceByDate[date][classId]) {
          attendanceByDate[date][classId] = {
            present: 0,
            absent: 0,
            total: 0
          };
        }
        
        // Count morning, afternoon, evening separately
        attendanceByDate[date][classId].total += 3; // 3 sessions per day
        if (record.morning) attendanceByDate[date][classId].present += 1;
        else attendanceByDate[date][classId].absent += 1;
        
        if (record.afternoon) attendanceByDate[date][classId].present += 1;
        else attendanceByDate[date][classId].absent += 1;
        
        if (record.evening) attendanceByDate[date][classId].present += 1;
        else attendanceByDate[date][classId].absent += 1;
      });
      
      // Convert to array format for table
      Object.entries(attendanceByDate).slice(0, 5).forEach(([date, classes]) => {
        Object.entries(classes).forEach(([classId, data]) => {
          recentAttendanceData.push({
            class: classId,
            date,
            present: data.present,
            absent: data.absent,
            rate: Math.round((data.present / data.total) * 100)
          });
        });
      });
      
      recentAttendanceData = recentAttendanceData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    
    // Process recent marks data
    let recentMarksData: MarkRecord[] = [];
    
    if (marksData && marksData.length > 0) {
      interface MarksBySubject {
        [key: string]: {
          subject: string;
          class: string;
          examType: string;
          total: number;
          count: number;
          status: "Completed" | "Pending";
        }
      }
      
      const marksBySubject: MarksBySubject = marksData.reduce((acc: MarksBySubject, mark: any) => {
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
      }, {});
      
      // Convert to array format for table
      recentMarksData = Object.values(marksBySubject).map(item => ({
        subject: item.subject,
        class: item.class,
        examType: item.examType,
        avgScore: `${Math.round(item.total / item.count)}/100`,
        status: item.status
      })).slice(0, 5);
    }
    
    return { stats, recentAttendanceData, recentMarksData };
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
