
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
    
    // Track attendance by slot
    const attendanceBySlot = {
      morning: { present: 0, absent: 0 },
      afternoon: { present: 0, absent: 0 },
      evening: { present: 0, absent: 0 },
    };
    
    if (attendanceData && attendanceData.length > 0) {
      totalAttendanceRecords = attendanceData.length * 3; // morning, afternoon, evening slots
      
      attendanceData.forEach((record: any) => {
        // Morning slot
        if (record.morning) {
          presentRecords++;
          attendanceBySlot.morning.present++;
        } else {
          attendanceBySlot.morning.absent++;
        }
        
        // Afternoon slot
        if (record.afternoon) {
          presentRecords++;
          attendanceBySlot.afternoon.present++;
        } else {
          attendanceBySlot.afternoon.absent++;
        }
        
        // Evening slot
        if (record.evening) {
          presentRecords++;
          attendanceBySlot.evening.present++;
        } else {
          attendanceBySlot.evening.absent++;
        }
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
      // Join with students data to get names
      const { data: studentsWithDetails } = await supabase
        .from('students')
        .select('id, name, class_id');
      
      const studentMap = new Map();
      if (studentsWithDetails) {
        studentsWithDetails.forEach((student: any) => {
          studentMap.set(student.id, { name: student.name, class: student.class_id });
        });
      }
      
      // Transform attendance data
      recentAttendanceData = attendanceData.slice(0, 10).map((record: any) => {
        const student = studentMap.get(record.student_id);
        const presentCount = (record.morning ? 1 : 0) + (record.afternoon ? 1 : 0) + (record.evening ? 1 : 0);
        const totalCount = 3; // morning, afternoon, evening
        
        return {
          studentName: student?.name || 'Unknown',
          class: student?.class || 'Unknown',
          date: record.date,
          present: presentCount,
          absent: totalCount - presentCount,
          rate: Math.round((presentCount / totalCount) * 100)
        };
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
    
    return { 
      stats, 
      recentAttendanceData, 
      recentMarksData,
      attendanceBySlot
    };
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
