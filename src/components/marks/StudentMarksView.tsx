
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
import { MarksRecord } from "./TeacherMarksView";

interface StudentMarksViewProps {
  profileId: string;
}

export const StudentMarksView = ({ profileId }: StudentMarksViewProps) => {
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<MarksRecord[]>([]);

  const studentColumns = [
    { header: "Subject", accessorKey: "subject_id" },
    { header: "Class", accessorKey: "class_id" },
    { header: "Exam Type", accessorKey: "exam_type" },
    { header: "Marks", accessorKey: "marks" },
  ];

  useEffect(() => {
    if (profileId) {
      fetchStudentMarks();
    }
  }, [profileId]);

  const fetchStudentMarks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", profileId);

      if (error) throw error;
      
      setMarks(data || []);
    } catch (error: any) {
      console.error("Error fetching student marks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Marks</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : marks.length > 0 ? (
          <DataTable 
            columns={studentColumns} 
            data={marks} 
          />
        ) : (
          <EmptyState 
            title="No marks available yet" 
            description="Your marks will be displayed here when they are available." 
          />
        )}
      </CardContent>
    </Card>
  );
};
