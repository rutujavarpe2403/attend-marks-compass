
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StudentDetailsTab } from "./details/StudentDetailsTab";
import { StudentAttendanceTab } from "./attendance/StudentAttendanceTab";
import { StudentPerformanceTab } from "./performance/StudentPerformanceTab";
import { fetchStudentDetails, fetchAttendanceSummary, fetchMarksData } from "./services/studentDataService";
import { StudentDetails, AttendanceSummary, MarksData, StudentViewProps } from "./types/student";

export const StudentView = ({ studentId, open, onOpenChange }: StudentViewProps) => {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [marksData, setMarksData] = useState<MarksData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (open && studentId) {
      fetchStudentData();
    }
  }, [open, studentId]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);

      const studentData = await fetchStudentDetails(studentId);
      setStudent(studentData);

      const attendanceData = await fetchAttendanceSummary(studentId);
      setAttendanceSummary(attendanceData);

      const marks = await fetchMarksData(studentId);
      setMarksData(marks);

    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading student details...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student?.name} - Student Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <StudentDetailsTab student={student} />
          </TabsContent>
          
          <TabsContent value="attendance">
            <StudentAttendanceTab attendanceSummary={attendanceSummary} />
          </TabsContent>
          
          <TabsContent value="performance">
            <StudentPerformanceTab marksData={marksData} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
