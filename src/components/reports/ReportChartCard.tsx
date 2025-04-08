
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { AttendanceChartView } from "./AttendanceChartView";
import { MarksChartView } from "./MarksChartView";

interface ReportChartCardProps {
  reportType: string;
  period: string;
  isLoading: boolean;
  attendanceData: any;
  marksData: any;
  handleDownloadReport: () => void;
}

export const ReportChartCard = ({
  reportType,
  period,
  isLoading,
  attendanceData,
  marksData,
  handleDownloadReport,
}: ReportChartCardProps) => {
  const title = reportType === "attendance" ? "Attendance Summary" : "Marks Summary";
  const description = `${period.charAt(0).toUpperCase() + period.slice(1)} ${reportType} summary`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reportType === "attendance" ? (
          <AttendanceChartView attendanceData={attendanceData} />
        ) : (
          <MarksChartView marksData={marksData} />
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={handleDownloadReport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
