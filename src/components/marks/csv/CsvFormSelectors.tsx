
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classes, boards, examTypes, subjects } from "../MarksContextData";

interface CsvFormSelectorsProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedBoard: string;
  setSelectedBoard: (value: string) => void;
  selectedExamType: string;
  setSelectedExamType: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
}

export const CsvFormSelectors = ({
  selectedClass,
  setSelectedClass,
  selectedBoard,
  setSelectedBoard,
  selectedExamType,
  setSelectedExamType,
  selectedSubject,
  setSelectedSubject,
}: CsvFormSelectorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">Class</label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                Class {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Board</label>
        <Select value={selectedBoard} onValueChange={setSelectedBoard}>
          <SelectTrigger>
            <SelectValue placeholder="Select board" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board} value={board}>
                {board}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Exam Type</label>
        <Select value={selectedExamType} onValueChange={setSelectedExamType}>
          <SelectTrigger>
            <SelectValue placeholder="Select exam type" />
          </SelectTrigger>
          <SelectContent>
            {examTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
