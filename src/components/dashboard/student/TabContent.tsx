
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentAttendanceTable } from "./RecentAttendanceTable";
import { RecentMarksTable } from "./RecentMarksTable";
import { RecentAttendance, RecentMark } from "./types";

interface AttendanceTabContentProps {
  recentAttendance: RecentAttendance[];
}

export const AttendanceTabContent = ({ recentAttendance }: AttendanceTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentAttendanceTable recentAttendance={recentAttendance} />
      </CardContent>
    </Card>
  );
};

interface MarksTabContentProps {
  recentMarks: RecentMark[];
}

export const MarksTabContent = ({ recentMarks }: MarksTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Marks</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentMarksTable recentMarks={recentMarks} />
      </CardContent>
    </Card>
  );
};
