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
import { DataTable } from "@/components/common/DataTable";
import { Loader2 } from "lucide-react";

interface UploadedRecord {
  student_name: string;
  marks: number;
  status: 'success' | 'error';
  error?: string;
}

interface MarksCsvUploadProps {
  onRecordsUpdate?: (records: UploadedRecord[]) => void;
}

export const MarksCsvUpload = ({ onRecordsUpdate }: MarksCsvUploadProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState<UploadedRecord[]>([]);

  const columns = [
    { header: "Student Name", accessorKey: "student_name" },
    { header: "Marks", accessorKey: "marks" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        return (
          <div className={`flex items-center ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'success' ? '✓' : '✗'}
            <span className="ml-2">{status === 'success' ? 'Success' : 'Failed'}</span>
          </div>
        );
      }
    },
    { 
      header: "Error", 
      accessorKey: "error",
      cell: ({ row }: { row: any }) => row.original.error || '-'
    }
  ];

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

      // Process records and track status
      const processedRecords: UploadedRecord[] = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (const record of records) {
        try {
          // Process each record
          const result = await processMarksUpload(
            [record],
            selectedClass,
            selectedBoard,
            selectedExamType,
            selectedSubject
          );
          
          if (result.errorCount === 0) {
            successCount++;
            processedRecords.push({
              student_name: record.student_name,
              marks: parseInt(record.marks, 10),
              status: 'success'
            });
          } else {
            errorCount++;
            processedRecords.push({
              student_name: record.student_name,
              marks: parseInt(record.marks, 10),
              status: 'error',
              error: 'Failed to upload'
            });
          }
        } catch (error: any) {
          errorCount++;
          processedRecords.push({
            student_name: record.student_name,
            marks: parseInt(record.marks, 10),
            status: 'error',
            error: error.message || 'Unknown error'
          });
        }
      }
      
      setUploadedRecords(processedRecords);
      
      // Call the onRecordsUpdate prop if provided
      if (onRecordsUpdate) {
        onRecordsUpdate(processedRecords);
      }
      
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

        {isUploading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {uploadedRecords.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
            <DataTable 
              columns={columns} 
              data={uploadedRecords}
              searchable={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
