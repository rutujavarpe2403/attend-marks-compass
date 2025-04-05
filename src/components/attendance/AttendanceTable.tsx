
import { useAuth } from "@/hooks/auth";
import { AttendanceForm } from "./AttendanceForm";
import { StudentAttendanceView } from "./StudentAttendanceView";

export const AttendanceTable = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance Management</h2>
        <p className="text-muted-foreground">
          {isTeacher ? "Record and manage student attendance" : "View your attendance records"}
        </p>
      </div>

      {isTeacher ? <AttendanceForm /> : <StudentAttendanceView />}
    </div>
  );
};
