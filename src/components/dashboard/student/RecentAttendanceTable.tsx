
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecentAttendance } from "./types";

interface RecentAttendanceTableProps {
  recentAttendance: RecentAttendance[];
}

export const RecentAttendanceTable = ({ recentAttendance }: RecentAttendanceTableProps) => {
  if (recentAttendance.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No recent attendance records found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentAttendance.map((attendance, i) => (
            <TableRow key={i}>
              <TableCell>{attendance.date}</TableCell>
              <TableCell>{attendance.present}</TableCell>
              <TableCell>{attendance.absent}</TableCell>
              <TableCell>
                <span className={attendance.rate >= 90 ? 'text-green-600' : attendance.rate >= 75 ? 'text-yellow-600' : 'text-red-600'}>
                  {attendance.rate}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
