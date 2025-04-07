
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AttendanceSummary, RecentAttendance, RecentMark, StudentDashboardData } from "./types";

export const fetchStudentDashboardData = async (profileId: string): Promise<StudentDashboardData> => {
  if (!profileId) {
    throw new Error("Profile ID is required");
  }
  
  try {
    // Fetch student record to get student_id
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', profileId)
      .single();
    
    if (studentError || !studentData) {
      console.error("Error fetching student data:", studentError);
      throw studentError;
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
      throw attendanceError;
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
      throw marksError;
    }

    // Process attendance data
    const attendanceSummary = processAttendanceData(attendanceData || []);
    
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

    return {
      attendanceSummary,
      recentAttendance,
      recentMarks: marksData || []
    };
    
  } catch (error) {
    console.error("Error loading student dashboard data:", error);
    throw error;
  }
};

const processAttendanceData = (attendanceData: any[]): AttendanceSummary => {
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
  
  return {
    present: totalPresent,
    absent: totalAbsent,
    percentage,
    bySlot: attendanceBySlot,
  };
};
