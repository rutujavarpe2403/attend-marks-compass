
import { supabase } from "@/integrations/supabase/client";

export const parseCSV = async (csvFile: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        // Check required columns - using student_name instead of student_id
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

export const processMarksUpload = async (
  records: any[], 
  selectedClass: string,
  selectedBoard: string,
  selectedExamType: string,
  selectedSubject: string
) => {
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

  return { successCount, errorCount };
};

export const generateSampleCsv = () => {
  const headers = "student_name,marks";
  const rows = [
    "John Doe,85",
    "Jane Smith,92",
    "Michael Johnson,78",
    "Emily Brown,95",
    "David Wilson,87"
  ];
  
  return [headers, ...rows].join("\n");
};
