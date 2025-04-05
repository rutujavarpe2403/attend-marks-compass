
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/common/DataTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { EmptyState } from "../common/EmptyState";
import { MarksFilterBar } from "./MarksFilterBar";

interface TeacherMarksViewProps {
  selectedClass: string;
  selectedBoard: string;
  selectedExamType: string;
  selectedSubject: string;
}

export interface MarksRecord {
  id: string;
  student_id: string;
  student_name?: string;
  class_id: string;
  board: string;
  exam_type: string;
  subject_id: string;
  marks: number;
}

export const TeacherMarksView = ({
  selectedClass,
  selectedBoard,
  selectedExamType,
  selectedSubject,
}: TeacherMarksViewProps) => {
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<MarksRecord[]>([]);

  const teacherColumns = [
    { header: "Student", accessorKey: "student_name" },
    { header: "Subject", accessorKey: "subject_id" },
    { header: "Class", accessorKey: "class_id" },
    { header: "Exam Type", accessorKey: "exam_type" },
    { header: "Marks", accessorKey: "marks" },
  ];

  useEffect(() => {
    if (selectedClass || selectedBoard || selectedExamType || selectedSubject) {
      fetchMarks();
    }
  }, [selectedClass, selectedBoard, selectedExamType, selectedSubject]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      let query = supabase.from("marks").select("*");
      
      if (selectedClass && selectedClass !== "all") {
        query = query.eq("class_id", selectedClass);
      }
      if (selectedBoard && selectedBoard !== "all") {
        query = query.eq("board", selectedBoard);
      }
      if (selectedExamType && selectedExamType !== "all") {
        query = query.eq("exam_type", selectedExamType);
      }
      if (selectedSubject && selectedSubject !== "all") {
        query = query.eq("subject_id", selectedSubject);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get student names
      const studentIds = data.map(m => m.student_id);
      const { data: students, error: studentsError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", studentIds);

      if (studentsError) throw studentsError;

      // Join marks with student names
      const marksWithNames = data.map(mark => {
        const student = students?.find(s => s.id === mark.student_id);
        return {
          ...mark,
          student_name: student?.name || "Unknown"
        };
      });

      setMarks(marksWithNames);
    } catch (error: any) {
      console.error("Error fetching marks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>View Marks</CardTitle>
      </CardHeader>
      <CardContent>
        <MarksFilterBar
          selectedClass={selectedClass}
          selectedBoard={selectedBoard}
          selectedExamType={selectedExamType}
          selectedSubject={selectedSubject}
        />
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : marks.length > 0 ? (
          <DataTable 
            columns={teacherColumns} 
            data={marks} 
            searchable={true}
          />
        ) : (
          <EmptyState 
            title="No marks found" 
            description="Use the filters above to view marks or upload marks using the CSV form." 
          />
        )}
      </CardContent>
    </Card>
  );
};
