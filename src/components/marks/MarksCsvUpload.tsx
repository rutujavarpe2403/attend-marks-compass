
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CsvFormSelectors } from "./csv/CsvFormSelectors";
import { CsvFileUploader } from "./csv/CsvFileUploader";
import { parseCSV, processMarksUpload } from "./csv/csvUtils";

export const MarksCsvUpload = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !selectedClass || !selectedBoard || !selectedExamType || !selectedSubject) {
      toast.error("Please select all required fields and upload a CSV file");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Parse the CSV file
      const records = await parseCSV(file);
      
      // Validate the data
      if (records.length === 0) {
        toast.error("No records found in CSV file");
        setIsUploading(false);
        return;
      }
      
      // Process and upload marks
      const { successCount, errorCount } = await processMarksUpload(
        records,
        selectedClass,
        selectedBoard,
        selectedExamType,
        selectedSubject
      );
      
      if (errorCount > 0) {
        toast.warning(`Uploaded ${successCount} records with ${errorCount} errors`);
      } else {
        toast.success(`Successfully uploaded ${successCount} marks records`);
      }
      
      // Reset the form
      setFile(null);
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error("Error uploading marks:", error);
      toast.error(error.message || "Failed to upload marks");
    } finally {
      setIsUploading(false);
    }
  };

  const isUploadDisabled = isUploading || !file || !selectedClass || !selectedBoard || !selectedExamType || !selectedSubject;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Marks CSV</CardTitle>
        <CardDescription>
          Upload a CSV file with student marks. The CSV should have at least 'student_name' and 'marks' columns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CsvFormSelectors
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
          selectedExamType={selectedExamType}
          setSelectedExamType={setSelectedExamType}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />
        
        <CsvFileUploader
          file={file}
          setFile={setFile}
          isUploading={isUploading}
          handleUpload={handleUpload}
          isUploadDisabled={isUploadDisabled}
        />
      </CardContent>
    </Card>
  );
};
