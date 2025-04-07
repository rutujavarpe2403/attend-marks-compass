
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceCharts } from "./AttendanceCharts";
import { AttendanceSummary } from "./types";

interface AttendanceChartSectionProps {
  attendanceSummary: AttendanceSummary;
}

export const AttendanceChartSection = ({ attendanceSummary }: AttendanceChartSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>
          Your attendance distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceCharts attendanceSummary={attendanceSummary} />
      </CardContent>
    </Card>
  );
};
