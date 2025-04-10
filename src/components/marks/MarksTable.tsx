import { useAuth } from "@/hooks/useAuth";
import { TeacherMarksContainer } from "./TeacherMarksContainer";
import { StudentMarksContainer } from "./StudentMarksContainer";

// Define the interface for uploaded records
interface UploadedRecord {
  student_name: string;
  marks: number;
  status: 'success' | 'error';
  error?: string;
}

interface MarksTableProps {
  onRecordsUpdate?: (records: UploadedRecord[]) => void;
}

export const MarksTable = ({ onRecordsUpdate }: MarksTableProps) => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Marks Management</h2>
        <p className="text-muted-foreground">
          {isTeacher ? "Record and manage student marks" : "View your academic marks"}
        </p>
      </div>

      {isTeacher ? (
        <TeacherMarksContainer onRecordsUpdate={onRecordsUpdate} />
      ) : (
        <StudentMarksContainer profileId={profile?.id || ''} />
      )}
    </div>
  );
};
