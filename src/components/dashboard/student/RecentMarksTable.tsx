
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecentMark } from "./types";

interface RecentMarksTableProps {
  recentMarks: RecentMark[];
}

export const RecentMarksTable = ({ recentMarks }: RecentMarksTableProps) => {
  if (recentMarks.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No recent marks found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Exam Type</TableHead>
            <TableHead>Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentMarks.map((mark, i) => (
            <TableRow key={i}>
              <TableCell>{mark.subject_id}</TableCell>
              <TableCell>{mark.class_id}</TableCell>
              <TableCell>{mark.exam_type}</TableCell>
              <TableCell>{mark.marks}/100</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
