
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceSummary } from "./types";

interface AttendanceSummaryCardProps {
  attendanceSummary: AttendanceSummary;
}

export const AttendanceSummaryCard = ({ attendanceSummary }: AttendanceSummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Overall attendance rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{attendanceSummary.percentage}%</div>
        <p className="text-sm text-muted-foreground">
          {attendanceSummary.present} present / {attendanceSummary.absent} absent
        </p>
      </CardContent>
    </Card>
  );
};
