
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { 
  Eye, 
  FileEdit, 
  Trash2, 
  Loader2, 
  UserPlus 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  class: string;
  batch: string;
  board: string;
}

export const StudentTable = ({ onAddClick }: { onAddClick: () => void }) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [boardFilter, setBoardFilter] = useState<string>("all");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // First get all profiles with role = student
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "student");

      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        setStudents([]);
        return;
      }

      // Then get all student details
      const { data: studentRecords, error: studentsError } = await supabase
        .from("students")
        .select("*");

      if (studentsError) throw studentsError;

      // Combine the data
      const combined = profiles.map(profile => {
        // Safely find the matching student record or provide defaults
        const studentDetails = studentRecords?.find(s => s.id === profile.id) || {
          class_id: "",
          batch: "",
          board: ""
        };

        return {
          id: profile.id,
          name: profile.name || "Unknown",
          email: "", // We'll set this later if we can get it
          class: studentDetails.class_id || "",
          batch: studentDetails.batch || "",
          board: studentDetails.board || "",
        };
      });

      // Try to get emails if possible (this may not work without admin access)
      try {
        const userIds = profiles.map(profile => profile.id);
        // Cast the result type more explicitly to avoid 'never' type issues
        const { data, error: usersError } = await supabase.auth.admin.listUsers({
          perPage: userIds.length
        });

        if (!usersError && data && data.users) {
          // Update the combined data with emails
          combined.forEach(student => {
            const user = data.users.find(u => u.id === student.id);
            if (user && user.email) {
              student.email = user.email;
            }
          });
        }
      } catch (emailError) {
        console.log("Could not fetch user emails:", emailError);
        // We continue without emails - it's not critical
      }

      setStudents(combined);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleViewStudent = (id: string) => {
    toast.info(`View student ${id}`);
  };

  const handleEditStudent = (id: string) => {
    toast.info(`Edit student ${id}`);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast.error(error.message || "Failed to delete student");
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Class", accessorKey: "class" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Board", accessorKey: "board" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: StudentRecord } }) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewStudent(row.original.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditStudent(row.original.id)}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteStudent(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredStudents = students.filter(student => {
    return (
      (classFilter === "all" || student.class === classFilter) &&
      (batchFilter === "all" || student.batch === batchFilter) &&
      (boardFilter === "all" || student.board === boardFilter)
    );
  });

  const classes = ["all", ...Array.from({ length: 12 }, (_, i) => `${i + 1}`)];
  const batches = ["all", "A", "B", "C", "D", "E"];
  const boards = ["all", "CBSE", "ICSE", "State Board"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="w-32">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls === "all" ? "All Classes" : `Class ${cls}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-32">
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch === "all" ? "All Batches" : `Batch ${batch}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select value={boardFilter} onValueChange={setBoardFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board} value={board}>
                    {board === "all" ? "All Boards" : board}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={onAddClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : students.length === 0 ? (
        <EmptyState 
          title="No students found" 
          description="Start by adding a new student." 
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredStudents}
              searchable
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
