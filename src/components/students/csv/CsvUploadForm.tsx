
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { processCsvFile, saveStudentsToDatabase } from "../utils/csvUtils";
import { CsvFormatInfo } from "./CsvFormatInfo";

interface CsvUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CsvUploadForm = ({ onSuccess, onCancel }: CsvUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      const file = data.file[0];
      
      if (!file) {
        toast.error("Please select a file to upload");
        setIsUploading(false);
        return;
      }

      const students = await processCsvFile(file);
      
      if (!students || students.length === 0) {
        toast.error("No valid student data found in the CSV file");
        setIsUploading(false);
        return;
      }
      
      const success = await saveStudentsToDatabase(students);
      
      if (success) {
        toast.success(`Successfully imported ${students.length} students`);
        onSuccess();
      } else {
        toast.error("Failed to import students");
      }
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      toast.error(error.message || "Failed to upload CSV file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CsvFormatInfo />

      <div className="grid gap-2">
        <Label htmlFor="file">CSV File</Label>
        <Input 
          id="file" 
          type="file" 
          accept=".csv" 
          disabled={isUploading} 
          {...register("file", { required: "Please select a CSV file" })} 
        />
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message as string}</p>
        )}
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload CSV"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
