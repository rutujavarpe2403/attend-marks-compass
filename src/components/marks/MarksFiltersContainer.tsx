
import { MarksFilterDropdown } from "./MarksFilterDropdown";
import { classes, boards, examTypes, subjects } from "./MarksContextData";

interface MarksFiltersContainerProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedBoard: string;
  setSelectedBoard: (value: string) => void;
  selectedExamType: string;
  setSelectedExamType: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
}

export const MarksFiltersContainer = ({
  selectedClass,
  setSelectedClass,
  selectedBoard,
  setSelectedBoard,
  selectedExamType,
  setSelectedExamType,
  selectedSubject,
  setSelectedSubject,
}: MarksFiltersContainerProps) => {
  // Prepare options for dropdowns
  const classOptions = classes.map(cls => ({ value: cls, label: `Class ${cls}` }));
  const boardOptions = boards.map(board => ({ value: board, label: board }));
  const examOptions = examTypes.map(type => ({ value: type, label: type }));
  const subjectOptions = subjects.map(subject => ({ value: subject, label: subject }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <MarksFilterDropdown
        label="Class"
        value={selectedClass}
        onValueChange={setSelectedClass}
        options={classOptions}
        placeholder="All Classes"
      />
      
      <MarksFilterDropdown
        label="Board"
        value={selectedBoard}
        onValueChange={setSelectedBoard}
        options={boardOptions}
        placeholder="All Boards"
      />
      
      <MarksFilterDropdown
        label="Exam"
        value={selectedExamType}
        onValueChange={setSelectedExamType}
        options={examOptions}
        placeholder="All Exams"
      />
      
      <MarksFilterDropdown
        label="Subject"
        value={selectedSubject}
        onValueChange={setSelectedSubject}
        options={subjectOptions}
        placeholder="All Subjects"
      />
    </div>
  );
};
