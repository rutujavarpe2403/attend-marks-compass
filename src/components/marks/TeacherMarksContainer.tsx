
import { useState } from "react";
import { MarksFiltersContainer } from "./MarksFiltersContainer";
import { MarksCsvUpload } from "./MarksCsvUpload";
import { TeacherMarksView } from "./TeacherMarksView";

export const TeacherMarksContainer = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  return (
    <div className="space-y-6">
      <MarksCsvUpload />
      
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
    </div>
  );
};
