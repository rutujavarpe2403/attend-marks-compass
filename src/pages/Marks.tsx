import { useState } from "react";
import { MarksTable } from "@/components/marks/MarksTable";
import { DataTable } from "@/components/common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the interface for uploaded records
interface UploadedRecord {
  student_name: string;
  marks: number;
  status: 'success' | 'error';
  error?: string;
}

const Marks = () => {
  // State to store uploaded records
  const [uploadedRecords, setUploadedRecords] = useState<UploadedRecord[]>([]);

  // Columns for the data table
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

  // Function to update uploaded records (will be passed to child components)
  const handleRecordsUpdate = (records: UploadedRecord[]) => {
    setUploadedRecords(records);
  };

  return (
    <div className="space-y-6">
      <MarksTable onRecordsUpdate={handleRecordsUpdate} />
      
      {uploadedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Student Records</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={uploadedRecords}
              searchable={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Marks;
