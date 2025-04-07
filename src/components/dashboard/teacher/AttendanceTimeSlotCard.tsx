
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceChart } from "./AttendanceChart";
import { AttendanceBySlot } from "./types";

interface AttendanceTimeSlotCardProps {
  attendanceBySlot: AttendanceBySlot;
}

export const AttendanceTimeSlotCard = ({ attendanceBySlot }: AttendanceTimeSlotCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Attendance by Time Slot</CardTitle>
        <CardDescription>
          Distribution of attendance across different time slots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceChart attendanceBySlot={attendanceBySlot} />
      </CardContent>
    </Card>
  );
};
