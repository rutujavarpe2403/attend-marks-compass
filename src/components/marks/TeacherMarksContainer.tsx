import { useState } from "react";
import { MarksFiltersContainer } from "./MarksFiltersContainer";
import { MarksCsvUpload } from "./MarksCsvUpload";
import { TeacherMarksView } from "./TeacherMarksView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the interface for uploaded records
interface UploadedRecord {
  student_name: string;
  marks: number;
  status: 'success' | 'error';
  error?: string;
}

interface TeacherMarksContainerProps {
  onRecordsUpdate?: (records: UploadedRecord[]) => void;
}

export const TeacherMarksContainer = ({ onRecordsUpdate }: TeacherMarksContainerProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view">
        <TabsList className="mb-4">
          <TabsTrigger value="view">View Marks</TabsTrigger>
          <TabsTrigger value="csv">Upload CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <MarksFiltersContainer
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedBoard={selectedBoard}
            setSelectedBoard={setSelectedBoard}
            selectedExamType={selectedExamType}
            setSelectedExamType={setSelectedExamType}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
          
          <TeacherMarksView 
            selectedClass={selectedClass}
            selectedBoard={selectedBoard}
            selectedExamType={selectedExamType}
            selectedSubject={selectedSubject}
          />
        </TabsContent>
        
        <TabsContent value="csv">
          <MarksCsvUpload onRecordsUpdate={onRecordsUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
