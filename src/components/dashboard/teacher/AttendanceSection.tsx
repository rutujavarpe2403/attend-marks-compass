
import { DataTable } from "@/components/common/DataTable";

export interface AttendanceRecord {
  class: string;
  date: string;
  present: number;
  absent: number;
  rate: number;
}

interface AttendanceSectionProps {
  recentAttendanceData: AttendanceRecord[];
}

export const AttendanceSection = ({ recentAttendanceData }: AttendanceSectionProps) => {
  const recentAttendanceColumns = [
    { header: "Class", accessorKey: "class" },
    { header: "Date", accessorKey: "date" },
    { header: "Present", accessorKey: "present" },
    { header: "Absent", accessorKey: "absent" },
    { 
      header: "Rate", 
      accessorKey: "rate",
      cell: ({ row }: { row: any }) => {
        const rate = row.original.rate;
        const colorClass = rate >= 90 ? "text-green-600" : rate >= 75 ? "text-yellow-600" : "text-red-600";
        return <span className={colorClass}>{rate}%</span>;
      }
    },
  ];

  return (
    <div>
      {recentAttendanceData.length > 0 ? (
        <DataTable columns={recentAttendanceColumns} data={recentAttendanceData} />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent attendance records found</p>
        </div>
      )}
    </div>
  );
};
