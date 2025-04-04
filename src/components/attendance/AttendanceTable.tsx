
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceForm } from "./AttendanceForm";

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

      <AttendanceForm />
    </div>
  );
};
