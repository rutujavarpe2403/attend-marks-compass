
import { Card, CardContent } from "@/components/ui/card";

export const MarksCSVExample = () => {
  const csvContent = `student_name,marks
John Doe,85
Jane Smith,92
Alex Johnson,78`;

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto whitespace-pre">
          {csvContent}
        </div>
      </CardContent>
    </Card>
  );
};
