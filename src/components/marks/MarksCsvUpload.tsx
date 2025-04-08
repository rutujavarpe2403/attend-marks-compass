import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { MarksCSVExample } from "./MarksCSVExample";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MarksCsvUpload = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const boards = ["CBSE", "ICSE", "State Board"];
  const examTypes = ["Midterm", "Final", "Quiz", "Assignment"];
  const subjects = ["Mathematics", "Science", "English", "History", "Geography"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = async (csvFile: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split("\n");
          const headers = lines[0].split(",").map(h => h.trim());
          
          // Check required columns - now using student_name instead of student_id
          if (!headers.includes("student_name") || !headers.includes("marks")) {
            reject("CSV file must contain 'student_name' and 'marks' columns");
            return;
          }
          
          const results = [];
          
          // Skip header row and parse data rows
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(",").map(v => v.trim());
            const row: any = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            
            results.push(row);
          }
          
          resolve(results);
        } catch (error) {
          reject("Failed to parse CSV file: " + error);
        }
      };
      reader.onerror = () => reject("Failed to read the file");
      reader.readAsText(csvFile);
    });
  };

  const handleUpload = async () => {
    if (!file || !selectedClass || !selectedBoard || !selectedExamType || !selectedSubject) {
      toast.error("Please select all required fields and upload a CSV file");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Parse the CSV file
      const records = await parseCSV(file);
      
      // Validate the data
      if (records.length === 0) {
        toast.error("No records found in CSV file");
        setIsUploading(false);
        return;
      }
      
      // Get student ID from name
      let successCount = 0;
      let errorCount = 0;
      
      for (const record of records) {
        try {
          // Find student ID from student name
          const { data: students, error: studentError } = await supabase
            .from("profiles")
            .select("id")
            .ilike("name", `%${record.student_name}%`);
          
          if (studentError || !students || students.length === 0) {
            console.error("Student not found:", record.student_name);
            errorCount++;
            continue;
          }

          const studentId = students[0].id;
          
          // Check if a record with the same combination already exists
          const { data: existingRecord, error: checkError } = await supabase
            .from("marks")
            .select("id")
            .eq("student_id", studentId)
            .eq("class_id", selectedClass)
            .eq("board", selectedBoard)
            .eq("exam_type", selectedExamType)
            .eq("subject_id", selectedSubject)
            .single();
          
          if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error checking existing record:", checkError);
            errorCount++;
            continue;
          }
          
          let result;
          
          if (existingRecord) {
            // Update existing record
            result = await supabase
              .from("marks")
              .update({ marks: parseInt(record.marks, 10) })
              .eq("id", existingRecord.id);
          } else {
            // Insert new record
            result = await supabase
              .from("marks")
              .insert({
                student_id: studentId,
                marks: parseInt(record.marks, 10),
                class_id: selectedClass,
                board: selectedBoard,
                exam_type: selectedExamType,
                subject_id: selectedSubject,
              });
          }
          
          if (result.error) {
            console.error("Error saving mark:", result.error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error("Error processing record:", err);
          errorCount++;
        }
      }
      
      if (errorCount > 0) {
        toast.warning(`Uploaded ${successCount} records with ${errorCount} errors`);
      } else {
        toast.success(`Successfully uploaded ${successCount} marks records`);
      }
      
      // Reset the form
      setFile(null);
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error("Error uploading marks:", error);
      toast.error(error.message || "Failed to upload marks");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Marks CSV</CardTitle>
        <CardDescription>
          Upload a CSV file with student marks. The CSV should have at least 'student_name' and 'marks' columns.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">CSV File</label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <button 
              type="button" 
              className="text-sm text-primary mt-1 underline"
              onClick={() => setShowSample(!showSample)}
            >
              {showSample ? "Hide sample format" : "View sample CSV format"}
            </button>
          </div>
          
          {showSample && <MarksCSVExample />}
          
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !file || !selectedClass || !selectedBoard || !selectedExamType || !selectedSubject}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Marks CSV
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
