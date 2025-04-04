
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MarksCsvUpload } from "./MarksCsvUpload";

export const MarksTable = () => {
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

      {isTeacher ? <MarksCsvUpload /> : (
        <div className="flex h-[50vh] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">Marks Records</h3>
            <p className="text-sm text-muted-foreground">
              Your marks will be displayed here when they are available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
