
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceSection } from "./AttendanceSection";
import { AttendanceRecord } from "./types";

interface RecentAttendanceCardProps {
  recentAttendanceData: AttendanceRecord[];
}

export const RecentAttendanceCard = ({ recentAttendanceData }: RecentAttendanceCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Attendance Records</CardTitle>
        <CardDescription>
          Overview of the most recent attendance records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceSection recentAttendanceData={recentAttendanceData} />
      </CardContent>
    </Card>
  );
};
