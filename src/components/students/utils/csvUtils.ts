
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { StudentCsvData } from "../types/csvTypes";
import { toast } from "sonner";

// Parse CSV file
export const processCsvFile = (file: File): Promise<StudentCsvData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        try {
          const data = results.data as StudentCsvData[];
          
          // Basic validation
          const validData = data.filter(row => {
            if (!row.name || !row.batch || !row.board) {
              return false;
            }
            return true;
          });
          
          resolve(validData);
        } catch (error) {
          reject(new Error("Error processing CSV file. Please check the format."));
        }
      },
      error: function(error) {
        reject(error);
      }
    });
  });
};

// Save students to database
export const saveStudentsToDatabase = async (students: StudentCsvData[]): Promise<boolean> => {
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const student of students) {
      // If email and password are provided, create auth user and link to student
      if (student.email && student.password) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: student.email,
            password: student.password || generateRandomPassword(),
            options: {
              data: {
                name: student.name,
                role: 'student'
              }
            }
          });
          
          if (authError) {
            errorCount++;
            console.error("Error creating auth user:", authError);
            continue;
          }
          
          // Create student record with auth user id
          if (authData.user) {
            const { error: studentError } = await supabase.from('students').insert({
              id: authData.user.id,
              name: student.name,
              batch: student.batch,
              class_id: student.class_id,
              board: student.board
            });
            
            if (studentError) {
              errorCount++;
              console.error("Error inserting student:", studentError);
            } else {
              successCount++;
            }
          }
        } catch (error) {
          errorCount++;
          console.error("Error creating student with auth:", error);
        }
      } else {
        // Create student record without auth user
        const { error } = await supabase.from('students').insert({
          name: student.name,
          batch: student.batch,
          class_id: student.class_id,
          board: student.board
        });
        
        if (error) {
          errorCount++;
          console.error("Error inserting student:", error);
        } else {
          successCount++;
        }
      }
    }

    toast.success(`Successfully imported ${successCount} students.`);
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} students. Check console for details.`);
    }
    
    return successCount > 0;
  } catch (error) {
    console.error("Error saving students to database:", error);
    return false;
  }
};

// Generate a random password
const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4);
};

// Download sample CSV
export const downloadSampleCsv = () => {
  const csvContent = 
`name,batch,class_id,board,email,password
John Doe,2023,Class A,CBSE,john.doe@example.com,password123
Jane Smith,2023,Class B,ICSE,jane.smith@example.com,password456
Alex Johnson,2023,Class A,CBSE,alex.johnson@example.com,password789`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "sample_students.csv");
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Sample CSV template downloaded");
};
