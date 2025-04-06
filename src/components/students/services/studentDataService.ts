
import { supabase } from "@/integrations/supabase/client";
import { AttendanceSummary, MarksData, StudentDetails } from "../types/student";

export const fetchStudentDetails = async (studentId: string) => {
  // Fetch student details
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (studentError) throw studentError;
  
  return studentData as StudentDetails;
};

export const fetchAttendanceSummary = async (studentId: string): Promise<AttendanceSummary> => {
  // Fetch attendance data
  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId);

  if (attendanceError) throw attendanceError;
  
  // Calculate attendance summary
  const totalDays = attendanceData?.length || 0;
  const presentDays = attendanceData?.filter(record => 
    record.morning || record.afternoon || record.evening
  ).length || 0;
  
  return {
    present: presentDays,
    absent: totalDays - presentDays,
    percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
  };
};

export const fetchMarksData = async (studentId: string): Promise<MarksData[]> => {
  // Fetch marks data
  const { data: marksData, error: marksError } = await supabase
    .from("marks")
    .select("*")
    .eq("student_id", studentId);

  if (marksError) throw marksError;
  
  return marksData || [];
};
