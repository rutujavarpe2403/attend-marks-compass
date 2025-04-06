
export interface StudentDetails {
  id: string;
  name: string;
  batch: string;
  class_id: string | null;
  board: string;
  email?: string;
  created_at?: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  percentage: number;
}

export interface MarksData {
  subject_id: string;
  marks: number;
  exam_type: string;
  total?: number;
}

export interface StudentViewProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
