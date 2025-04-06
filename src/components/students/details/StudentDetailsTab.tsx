
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { StudentDetails } from "../types/student";

interface StudentDetailsTabProps {
  student: StudentDetails | null;
}

export const StudentDetailsTab = ({ student }: StudentDetailsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{student?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Class</p>
            <p>{student?.class_id || "Not assigned"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Batch</p>
            <p>{student?.batch}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Board</p>
            <p>{student?.board}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Registered Date</p>
            <p>{student?.created_at ? format(new Date(student.created_at), 'PPP') : 'Unknown'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
