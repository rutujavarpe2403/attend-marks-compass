
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email?: string;
  batch: string;
  class_id: string | null;
  board: string;
}

interface StudentEditProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const StudentEdit = ({ student, open, onOpenChange, onSuccess }: StudentEditProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: student.name,
      batch: student.batch,
      class_id: student.class_id || "",
      board: student.board
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("students")
        .update({
          name: data.name,
          batch: data.batch,
          class_id: data.class_id || null,
          board: data.board
        })
        .eq("id", student.id);
      
      if (error) throw error;
      
      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Name is required" })} 
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="batch">Batch</Label>
            <Input 
              id="batch" 
              {...register("batch", { required: "Batch is required" })} 
            />
            {errors.batch && (
              <p className="text-sm text-destructive">{errors.batch.message as string}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="class_id">Class</Label>
            <Input 
              id="class_id" 
              {...register("class_id")} 
              placeholder="Optional"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="board">Board</Label>
            <Select 
              onValueChange={(value) => setValue("board", value)}
              defaultValue={student.board}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
                <SelectItem value="State">State Board</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.board && (
              <p className="text-sm text-destructive">{errors.board.message as string}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
