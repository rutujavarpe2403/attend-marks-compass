
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
  recentAttendance: RecentAttendance[];
  recentMarks: RecentMark[];
}

export interface RecentAttendance {
  date: string;
  present: number;
  absent: number;
  rate: number;
}

export interface RecentMark {
  subject_id: string;
  class_id: string;
  exam_type: string;
  marks: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
