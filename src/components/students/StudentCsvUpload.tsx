
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CsvUploadForm } from "./csv/CsvUploadForm";

interface StudentCsvUploadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const StudentCsvUpload = ({ onSuccess, onCancel }: StudentCsvUploadProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Students from CSV</CardTitle>
        <CardDescription>Upload a CSV file with student information</CardDescription>
      </CardHeader>
      <CardContent>
        <CsvUploadForm onSuccess={onSuccess} onCancel={onCancel} />
      </CardContent>
    </Card>
  );
};
