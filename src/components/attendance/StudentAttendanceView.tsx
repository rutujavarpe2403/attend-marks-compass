
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id && selectedDate) {
      fetchAttendanceForDate();
    }
  }, [user?.id, selectedDate]);

  const fetchAttendanceForDate = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", user.id)
        .eq("date", formattedDate)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching attendance:", error);
        throw error;
      }
      
      setAttendance(data || null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>View My Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Select Date</label>
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
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : attendance ? (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Attendance Status for {format(selectedDate, "PPP")}</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-md flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground mb-2">Morning</span>
                  <Badge variant={attendance.morning ? "success" : "destructive"}>
                    {attendance.morning ? "Present" : "Absent"}
                  </Badge>
                </div>
                <div className="p-4 border rounded-md flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground mb-2">Afternoon</span>
                  <Badge variant={attendance.afternoon ? "success" : "destructive"}>
                    {attendance.afternoon ? "Present" : "Absent"}
                  </Badge>
                </div>
                <div className="p-4 border rounded-md flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground mb-2">Evening</span>
                  <Badge variant={attendance.evening ? "success" : "destructive"}>
                    {attendance.evening ? "Present" : "Absent"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No attendance record"
              description={`No attendance record found for ${format(selectedDate, "PPP")}`}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
