
export interface DashboardStats {
  totalStudents: number;
  attendanceRate: number;
  averageGrade: number;
}

export interface AttendanceBySlot {
  morning: { present: number; absent: number };
  afternoon: { present: number; absent: number };
  evening: { present: number; absent: number };
}

export interface AttendanceRecord {
  studentName?: string;
  class: string;
  date: string;
  present: number;
  absent: number;
  rate: number;
}

export interface MarkRecord {
  subject: string;
  class: string;
  examType: string;
  avgScore: string;
  status: "Completed" | "Pending";
}

export interface TeacherDashboardData {
  stats: DashboardStats;
  recentAttendanceData: AttendanceRecord[];
  recentMarksData: MarkRecord[];
  attendanceBySlot: AttendanceBySlot;
}
