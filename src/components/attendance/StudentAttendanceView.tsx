
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";

type AttendanceRecord = {
  id: string;
  date: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};

export const StudentAttendanceView = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "all">("weekly");

  useEffect(() => {
    if (user?.id) {
      fetchAttendanceRecords();
    }
  }, [user?.id, timeRange]);

  const fetchAttendanceRecords = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected time range
      let fromDate;
      const today = new Date();
      
      if (timeRange === "weekly") {
        // Last 7 days
        fromDate = new Date();
        fromDate.setDate(today.getDate() - 7);
      } else if (timeRange === "monthly") {
        // Last 30 days
        fromDate = new Date();
        fromDate.setDate(today.getDate() - 30);
      }
      
      // Build query
      let query = supabase
        .from("attendance")
        .select("*")
        .eq("student_id", user.id)
        .order("date", { ascending: false });
      
      // Add date filter if applicable
      if (fromDate) {
        query = query.gte("date", format(fromDate, "yyyy-MM-dd"));
      }
      
      const { data, error } = await query;
        
      if (error) {
        console.error("Error fetching attendance:", error);
        throw error;
      }
      
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate attendance statistics
  const totalDays = attendanceRecords.length;
  let presentDays = 0;
  let absentDays = 0;
  
  attendanceRecords.forEach(record => {
    const sessionsPresent = [record.morning, record.afternoon, record.evening].filter(Boolean).length;
    if (sessionsPresent >= 2) { // Present if attended at least 2 sessions
      presentDays++;
    } else {
      absentDays++;
    }
  });
  
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>My Attendance Records</span>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as "weekly" | "monthly" | "all")} className="w-full max-w-xs">
              <TabsList className="w-full">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-md flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground mb-1">Attendance Rate</span>
              <span className="text-2xl font-bold">{attendanceRate}%</span>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground mb-1">Days Present</span>
              <span className="text-2xl font-bold">{presentDays}</span>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground mb-1">Days Absent</span>
              <span className="text-2xl font-bold">{absentDays}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : attendanceRecords.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Morning</TableHead>
                    <TableHead>Afternoon</TableHead>
                    <TableHead>Evening</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                      <TableCell>
                        <AttendanceStatus present={record.morning} />
                      </TableCell>
                      <TableCell>
                        <AttendanceStatus present={record.afternoon} />
                      </TableCell>
                      <TableCell>
                        <AttendanceStatus present={record.evening} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="No attendance records"
              description="No attendance has been recorded for the selected time period"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AttendanceStatus = ({ present }: { present: boolean }) => {
  return (
    <Badge variant={present ? "success" : "destructive"}>
      {present ? "Present" : "Absent"}
    </Badge>
  );
};
