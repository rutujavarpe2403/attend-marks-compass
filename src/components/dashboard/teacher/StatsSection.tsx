
import { Users, CheckCircle, BookOpen, FileText } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";

interface StatsSectionProps {
  stats: {
    totalStudents: number;
    attendanceRate: number;
    averageGrade: number;
    pendingReports: number;
  };
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Students"
        value={String(stats.totalStudents)}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+5%"
        trendDirection="up"
      />
      <StatsCard
        title="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        trend="+2%"
        trendDirection="up"
      />
      <StatsCard
        title="Average Grade"
        value={stats.averageGrade > 0 ? `${stats.averageGrade}/100` : "N/A"}
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        trend="+3%"
        trendDirection="up"
      />
      <StatsCard
        title="Pending Reports"
        value={String(stats.pendingReports)}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        trend="-2"
        trendDirection="down"
      />
    </div>
  );
};
