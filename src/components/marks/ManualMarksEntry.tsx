
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

export const ManualMarksEntry = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<{id: string, name: string}[]>([]);
  
  const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const boards = ["CBSE", "ICSE", "State Board"];
  const examTypes = ["Midterm", "Final", "Quiz", "Assignment"];
  const subjects = ["Mathematics", "Science", "English", "History", "Geography"];

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "student");
        
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedStudent || !selectedClass || !selectedBoard || !selectedExamType || !selectedSubject || !marks) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Validate marks
    const marksValue = parseInt(marks, 10);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      toast.error("Marks must be a number between 0 and 100");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if record already exists
      const { data: existingRecord, error: checkError } = await supabase
        .from("marks")
        .select("id")
        .eq("student_id", selectedStudent)
        .eq("class_id", selectedClass)
        .eq("board", selectedBoard)
        .eq("exam_type", selectedExamType)
        .eq("subject_id", selectedSubject)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from("marks")
          .update({ marks: marksValue })
          .eq("id", existingRecord.id);
      } else {
        // Insert new record
        result = await supabase
          .from("marks")
          .insert({
            student_id: selectedStudent,
            class_id: selectedClass,
            board: selectedBoard,
            exam_type: selectedExamType,
            subject_id: selectedSubject,
            marks: marksValue
          });
      }
      
      if (result.error) throw result.error;
      
      toast.success(existingRecord ? "Marks updated successfully" : "Marks added successfully");
      
      // Reset form
      setMarks("");
    } catch (error: any) {
      console.error("Error saving marks:", error);
      toast.error(error.message || "Failed to save marks");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Marks Entry</CardTitle>
        <CardDescription>Add or update student marks manually</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Board</label>
            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board} value={board}>
                    {board}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Exam Type</label>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Marks</label>
            <Input 
              type="number" 
              min="0"
              max="100"
              value={marks} 
              onChange={(e) => setMarks(e.target.value)}
              placeholder="Enter marks (0-100)"
            />
          </div>
        </div>
        
        <Button
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Save Marks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
