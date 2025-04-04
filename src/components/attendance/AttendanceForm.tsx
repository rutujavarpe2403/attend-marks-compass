
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

type AttendanceRecord = {
  id: string;
  name: string;
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
};

export const AttendanceForm = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const batches = ["A", "B", "C", "D", "E"];
  const boards = ["CBSE", "ICSE", "State Board"];

  const searchStudents = async () => {
    if (!selectedClass || !selectedBatch || !selectedBoard) {
      toast.error("Please select class, batch and board");
      return;
    }

    try {
      setIsSearching(true);
      
      // Get students matching the criteria
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, name")
        .eq("class_id", selectedClass)
        .eq("batch", selectedBatch)
        .eq("board", selectedBoard);
        
      if (studentError) throw studentError;

      if (!studentData || studentData.length === 0) {
        setStudents([]);
        return;
      }

      // Format the date to YYYY-MM-DD
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      // Get existing attendance records for these students on the selected date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", formattedDate)
        .in("student_id", studentData.map(s => s.id));

      if (attendanceError) throw attendanceError;

      // Combine student data with attendance data
      const combinedData = studentData.map(student => {
        const attendance = attendanceData?.find(a => a.student_id === student.id);
        return {
          id: student.id,
          name: student.name,
          morning: attendance?.morning || false,
          afternoon: attendance?.afternoon || false,
          evening: attendance?.evening || false,
        };
      });

      setStudents(combinedData);
    } catch (error: any) {
      console.error("Error searching students:", error);
      toast.error(error.message || "Failed to search students");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAttendanceChange = (studentId: string, period: "morning" | "afternoon" | "evening", value: boolean) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, [period]: value } : student
      )
    );
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;

    try {
      setIsSaving(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Prepare the records to upsert
      const records = students.map(student => ({
        student_id: student.id,
        date: formattedDate,
        morning: student.morning || false,
        afternoon: student.afternoon || false,
        evening: student.evening || false,
      }));

      // Upsert the records (insert if not exists, update if exists)
      const { error } = await supabase
        .from("attendance")
        .upsert(records, { onConflict: 'student_id,date' });

      if (error) throw error;
      
      toast.success("Attendance saved successfully");
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast.error(error.message || "Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <label className="block text-sm font-medium mb-1">Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      Batch {batch}
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
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            onClick={searchStudents} 
            disabled={isSearching || !selectedClass || !selectedBatch || !selectedBoard}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Students"
            )}
          </Button>

          {students.length > 0 ? (
            <div className="mt-6">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Morning</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Afternoon</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Evening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-4">{student.name}</td>
                        <td className="p-4 text-center">
                          <Checkbox
                            checked={student.morning}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, "morning", !!checked)}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <Checkbox
                            checked={student.afternoon}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, "afternoon", !!checked)}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <Checkbox
                            checked={student.evening}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, "evening", !!checked)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSaveAttendance} 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Attendance"
                  )}
                </Button>
              </div>
            </div>
          ) : isSearching ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
