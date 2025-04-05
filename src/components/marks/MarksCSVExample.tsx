
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const MarksCSVExample = () => {
  const handleDownloadSample = () => {
    // Create a sample CSV content
    const csvContent = "student_id,marks,comments\n" +
      "123e4567-e89b-12d3-a456-426614174000,85,Good performance\n" +
      "456e4567-e89b-12d3-a456-426614174001,92,Excellent work\n" +
      "789e4567-e89b-12d3-a456-426614174002,78,Needs improvement";
    
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "marks_sample.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
      <h3 className="font-medium mb-2">CSV File Format</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Your CSV file should contain the following columns:
      </p>
      <div className="bg-background p-3 rounded border overflow-x-auto mb-3">
        <code className="text-sm">student_id,marks,comments</code>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
        <li><strong>student_id:</strong> The UUID of the student</li>
        <li><strong>marks:</strong> Numeric value of the marks</li>
        <li><strong>comments:</strong> Optional comments (not required)</li>
      </ul>
      <Button variant="outline" size="sm" onClick={handleDownloadSample}>
        <Download className="mr-2 h-4 w-4" />
        Download Sample CSV
      </Button>
    </div>
  );
};
