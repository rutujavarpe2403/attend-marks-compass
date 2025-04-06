
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InfoIcon, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StudentCsvUploadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const StudentCsvUpload = ({ onSuccess, onCancel }: StudentCsvUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      const file = data.file[0];
      if (!file) {
        toast.error("Please select a file to upload");
        return;
      }

      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          const rows = csvContent.split('\n').filter(row => row.trim());
          
          // Skip header row
          const header = rows[0].split(',').map(column => column.trim());
          const nameIndex = header.indexOf('name');
          const batchIndex = header.indexOf('batch');
          const classIndex = header.indexOf('class_id');
          const boardIndex = header.indexOf('board');
          
          // Validate required columns
          if (nameIndex === -1 || batchIndex === -1 || boardIndex === -1) {
            toast.error("CSV file must contain name, batch, and board columns");
            setIsUploading(false);
            return;
          }
          
          // Process data rows
          const students = [];
          for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',').map(column => column.trim());
            
            // Skip empty rows
            if (columns.length < header.length) continue;
            
            const student = {
              name: columns[nameIndex],
              batch: columns[batchIndex],
              class_id: classIndex !== -1 ? columns[classIndex] : null,
              board: columns[boardIndex]
            };
            
            // Validate required fields
            if (!student.name || !student.batch || !student.board) {
              continue;
            }
            
            students.push(student);
          }
          
          if (students.length === 0) {
            toast.error("No valid student data found in the CSV file");
            setIsUploading(false);
            return;
          }
          
          // Insert students in batch
          const { error } = await supabase
            .from('students')
            .insert(students);
          
          if (error) throw error;
          
          toast.success(`Successfully imported ${students.length} students`);
          onSuccess();
        } catch (error) {
          console.error("Error processing CSV file:", error);
          toast.error("Failed to process CSV file");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload CSV file");
      setIsUploading(false);
    }
  };
  
  // Function to download sample CSV template
  const downloadSampleCsv = () => {
    const sampleContent = "name,batch,class_id,board\nJohn Doe,2025,10A,CBSE\nJane Smith,2025,10B,ICSE";
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Students from CSV</CardTitle>
        <CardDescription>Upload a CSV file with student information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>CSV Format</AlertTitle>
            <AlertDescription>
              Your CSV file should contain columns for name, batch, class_id (optional), and board.
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={downloadSampleCsv}
              >
                <Download className="h-4 w-4 mr-1" />
                Download sample template
              </Button>
            </AlertDescription>
          </Alert>

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
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={isUploading} className="mr-2">
              {isUploading ? "Uploading..." : "Upload CSV"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
