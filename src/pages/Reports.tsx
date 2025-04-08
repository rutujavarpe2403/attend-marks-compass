
import { useAuth } from "@/hooks/auth";
import { useReportsData } from "@/components/reports/useReportsData";
import { ReportSelector } from "@/components/reports/ReportSelector";
import { ReportChartCard } from "@/components/reports/ReportChartCard";

const Reports = () => {
  const { profile } = useAuth();
  const {
    reportType,
    setReportType,
    period,
    setPeriod,
    isLoading,
    attendanceData,
    marksData,
    handleGenerateReport,
    handleDownloadReport,
  } = useReportsData();

  const isTeacher = profile?.role === "teacher";
  
  if (!isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Reports are only available for teachers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and analyze attendance and marks reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ReportSelector
          reportType={reportType}
          setReportType={setReportType}
          period={period}
          setPeriod={setPeriod}
          handleGenerateReport={handleGenerateReport}
        />

        <ReportChartCard
          reportType={reportType}
          period={period}
          isLoading={isLoading}
          attendanceData={attendanceData}
          marksData={marksData}
          handleDownloadReport={handleDownloadReport}
        />
      </div>
    </div>
  );
};

export default Reports;
