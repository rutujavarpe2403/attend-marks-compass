
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportSelectorProps {
  reportType: string;
  setReportType: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  handleGenerateReport: () => void;
}

export const ReportSelector = ({
  reportType,
  setReportType,
  period,
  setPeriod,
  handleGenerateReport,
}: ReportSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>
          Generate various reports based on your requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="type">
            Report Type
          </label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance Report</SelectItem>
              <SelectItem value="marks">Marks Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="period">
            Time Period
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleGenerateReport}>
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
};
