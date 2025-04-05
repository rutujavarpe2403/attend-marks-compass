
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MarksCsvUpload } from "./MarksCsvUpload";
import { DataTable } from "@/components/common/DataTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

interface MarksRecord {
  id: string;
  student_id: string;
  student_name?: string;
  class_id: string;
  board: string;
  exam_type: string;
  subject_id: string;
  marks: number;
}

export const MarksTable = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<MarksRecord[]>([]);
  
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const boards = ["CBSE", "ICSE", "State Board"];
  const examTypes = ["Midterm", "Final", "Quiz", "Assignment"];
  const subjects = ["Mathematics", "Science", "English", "History", "Geography"];

  useEffect(() => {
    if (isTeacher && (selectedClass || selectedBoard || selectedExamType || selectedSubject)) {
      fetchMarks();
    } else if (!isTeacher) {
      fetchStudentMarks();
    }
  }, [isTeacher, selectedClass, selectedBoard, selectedExamType, selectedSubject]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      let query = supabase.from("marks").select("*");
      
      if (selectedClass) {
        query = query.eq("class_id", selectedClass);
      }
      if (selectedBoard) {
        query = query.eq("board", selectedBoard);
      }
      if (selectedExamType) {
        query = query.eq("exam_type", selectedExamType);
      }
      if (selectedSubject) {
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

  const fetchStudentMarks = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", profile.id);

      if (error) throw error;
      
      setMarks(data || []);
    } catch (error: any) {
      console.error("Error fetching student marks:", error);
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    { header: "Subject", accessorKey: "subject_id" },
    { header: "Class", accessorKey: "class_id" },
    { header: "Exam Type", accessorKey: "exam_type" },
    { header: "Marks", accessorKey: "marks" },
  ];

  const teacherColumns = [
    { header: "Student", accessorKey: "student_name" },
    { header: "Subject", accessorKey: "subject_id" },
    { header: "Class", accessorKey: "class_id" },
    { header: "Exam Type", accessorKey: "exam_type" },
    { header: "Marks", accessorKey: "marks" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Marks Management</h2>
        <p className="text-muted-foreground">
          {isTeacher ? "Record and manage student marks" : "View your academic marks"}
        </p>
      </div>

      {isTeacher ? (
        <>
          <MarksCsvUpload />
          
          <Card>
            <CardHeader>
              <CardTitle>View Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          Class {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Board</label>
                  <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Boards" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Boards</SelectItem>
                      {boards.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Exam</label>
                  <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Exams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
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
        </>
      ) : (
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
      )}
    </div>
  );
};
