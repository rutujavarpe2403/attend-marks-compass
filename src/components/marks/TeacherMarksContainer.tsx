
import { useState } from "react";
import { MarksFiltersContainer } from "./MarksFiltersContainer";
import { MarksCsvUpload } from "./MarksCsvUpload";
import { TeacherMarksView } from "./TeacherMarksView";
import { ManualMarksEntry } from "./ManualMarksEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TeacherMarksContainer = () => {
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
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
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
          <MarksCsvUpload />
        </TabsContent>
        
        <TabsContent value="manual">
          <ManualMarksEntry />
        </TabsContent>
      </Tabs>
    </div>
  );
};
