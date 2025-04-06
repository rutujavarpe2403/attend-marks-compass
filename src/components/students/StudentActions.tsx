
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { StudentView } from "./StudentView";
import { StudentEdit } from "./StudentEdit";
import { StudentDeleteDialog } from "./dialogs/StudentDeleteDialog";
import { StudentActionProps } from "./types/actionTypes";

export const StudentActions = ({ student, onStudentDeleted }: StudentActionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    onStudentDeleted?.(); // Refresh the list
    toast.success("Student updated successfully");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowViewDialog(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <StudentDeleteDialog
          studentId={student.id}
          studentName={student.name}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={onStudentDeleted}
        />
      )}

      {/* View Student Dialog */}
      {showViewDialog && (
        <StudentView 
          studentId={student.id}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}

      {/* Edit Student Dialog */}
      {showEditDialog && (
        <StudentEdit
          student={student}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
