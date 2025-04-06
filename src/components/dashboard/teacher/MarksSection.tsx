
import { CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";

export interface MarkRecord {
  subject: string;
  class: string;
  examType: string;
  avgScore: string;
  status: "Completed" | "Pending";
}

interface MarksSectionProps {
  recentMarksData: MarkRecord[];
}

export const MarksSection = ({ recentMarksData }: MarksSectionProps) => {
  const recentMarksColumns = [
    { header: "Subject", accessorKey: "subject" },
    { header: "Class", accessorKey: "class" },
    { header: "Exam Type", accessorKey: "examType" },
    { header: "Avg. Score", accessorKey: "avgScore" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        const icon = status === "Completed" ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-yellow-600" />
        );
        return (
          <div className="flex items-center">
            {icon}
            <span className="ml-2">{status}</span>
          </div>
        );
      }
    },
  ];

  return (
    <div>
      {recentMarksData.length > 0 ? (
        <DataTable columns={recentMarksColumns} data={recentMarksData} />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent mark entries found</p>
        </div>
      )}
    </div>
  );
};
