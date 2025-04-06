
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface StudentViewProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StudentDetails {
  id: string;
  name: string;
  batch: string;
  class_id: string | null;
  board: string;
  email?: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  percentage: number;
}

interface MarksData {
  subject_id: string;
  marks: number;
  exam_type: string;
  total?: number;
}

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
      fetchStudentDetails();
    }
  }, [open, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch student details
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      if (studentError) throw studentError;
      
      setStudent(studentData);

      // Fetch attendance data
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId);

      if (attendanceError) throw attendanceError;
      
      // Calculate attendance summary
      const totalDays = attendanceData?.length || 0;
      const presentDays = attendanceData?.filter(record => 
        record.morning || record.afternoon || record.evening
      ).length || 0;
      
      setAttendanceSummary({
        present: presentDays,
        absent: totalDays - presentDays,
        percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
      });

      // Fetch marks data
      const { data: marksData, error: marksError } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", studentId);

      if (marksError) throw marksError;
      
      setMarksData(marksData || []);

    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Attendance pie chart data
  const attendancePieData = [
    { name: 'Present', value: attendanceSummary.present, color: '#10b981' },
    { name: 'Absent', value: attendanceSummary.absent, color: '#ef4444' },
  ];

  // Subject performance data
  const subjectPerformance = marksData.reduce((acc, curr) => {
    if (!acc[curr.subject_id]) {
      acc[curr.subject_id] = { total: 0, count: 0 };
    }
    acc[curr.subject_id].total += curr.marks;
    acc[curr.subject_id].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const subjectPerformanceData = Object.entries(subjectPerformance).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count),
  }));

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
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{student?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Class</p>
                    <p>{student?.class_id || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Batch</p>
                    <p>{student?.batch}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Board</p>
                    <p>{student?.board}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Registered Date</p>
                    <p>{student?.created_at ? format(new Date(student.created_at), 'PPP') : 'Unknown'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-background p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold">{attendanceSummary.percentage}%</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Days Present</p>
                    <p className="text-2xl font-bold">{attendanceSummary.present}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Days Absent</p>
                    <p className="text-2xl font-bold">{attendanceSummary.absent}</p>
                  </div>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendancePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {attendancePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {marksData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectPerformanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Average Score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
