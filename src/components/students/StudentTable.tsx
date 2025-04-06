
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "../common/DataTable";
import { StudentActions } from "./StudentActions";
import { Button } from "../ui/button";
import { PlusCircle, UploadCloud } from "lucide-react";
import { EmptyState } from "../common/EmptyState";
import { toast } from "sonner";
import { StudentCsvUpload } from "./StudentCsvUpload";

interface Student {
  id: string;
  name: string;
  email?: string;
  batch: string;
  class_id: string | null;
  board: string;
  created_at: string | null;
}

interface Column {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { original: Student } }) => React.ReactNode;
}

interface StudentTableProps {
  onAddClick?: () => void;
}

export const StudentTable = ({ onAddClick }: StudentTableProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  const columns: Column[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Class", accessorKey: "class_id" },
    { header: "Board", accessorKey: "board" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => <StudentActions student={row.original} onStudentDeleted={fetchStudents} />,
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("students").select("*");

      if (error) throw error;

      if (data) {
        const studentIds = data.map((student) => student.id);
        const emails = await getStudentManagers(studentIds);
        setUserEmails(emails);

        const studentsWithEmails = data.map((student) => ({
          ...student,
          email: emails[student.id] || "N/A",
        }));

        setStudents(studentsWithEmails);
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const getStudentManagers = async (userIds: string[]) => {
    try {
      if (userIds.length === 0) return {};
      
      // We need to handle this more safely
      const response = await supabase.auth.admin.listUsers({
        perPage: 100,
      });
      
      // Early return if there's an error
      if (response.error) {
        console.error("Error fetching users:", response.error);
        return {};
      }
      
      // Safely access the users property
      const users = response.data?.users || [];
      
      // Create a map of userId to email
      const userEmails: Record<string, string> = {};
      users.forEach((user) => {
        if (user && user.id) {
          userEmails[user.id] = user.email || '';
        }
      });
      
      return userEmails;
    } catch (error) {
      console.error("Error fetching user emails:", error);
      return {};
    }
  };

  const handleCsvUploadSuccess = () => {
    setShowCsvUpload(false);
    fetchStudents();
    toast.success("Students imported successfully");
  };

  return (
    <div className="space-y-4">
      {showCsvUpload ? (
        <StudentCsvUpload 
          onCancel={() => setShowCsvUpload(false)}
          onSuccess={handleCsvUploadSuccess}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Students</h2>
            <div className="flex gap-2">
              <Button onClick={() => setShowCsvUpload(true)} variant="outline">
                <UploadCloud className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
              <Button onClick={onAddClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : students.length > 0 ? (
            <DataTable columns={columns} data={students} searchable={true} />
          ) : (
            <EmptyState
              title="No students found"
              description="Add new students to get started."
            />
          )}
        </>
      )}
    </div>
  );
};
