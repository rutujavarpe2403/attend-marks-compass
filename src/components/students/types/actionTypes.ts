
export interface StudentActionProps {
  student: {
    id: string;
    name: string;
    email?: string;
    batch: string;
    class_id: string | null;
    board: string;
    created_at: string | null;
  };
  onStudentDeleted?: () => void;
}
