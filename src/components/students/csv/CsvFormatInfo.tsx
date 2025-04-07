
import { InfoIcon, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { downloadSampleCsv } from "../utils/csvUtils";

export const CsvFormatInfo = () => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>CSV Format</AlertTitle>
      <AlertDescription>
        Your CSV file should contain columns for name, batch, class_id (optional), board, email (optional), and password (optional).
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
  );
};
