
import { supabase } from "@/integrations/supabase/client";
import { StudentCsvData } from "../types/csvTypes";

export const processCsvFile = async (file: File): Promise<StudentCsvData[] | null> => {
  try {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          const rows = csvContent.split('\n').filter(row => row.trim());
          
          // Parse header row
          const header = rows[0].split(',').map(column => column.trim());
          const nameIndex = header.indexOf('name');
          const batchIndex = header.indexOf('batch');
          const classIndex = header.indexOf('class_id');
          const boardIndex = header.indexOf('board');
          const emailIndex = header.indexOf('email');
          const passwordIndex = header.indexOf('password');
          
          // Validate required columns
          if (nameIndex === -1 || batchIndex === -1 || boardIndex === -1) {
            reject(new Error("CSV file must contain name, batch, and board columns"));
            return;
          }
          
          // Process data rows
          const students: StudentCsvData[] = [];
          const authPromises: Promise<StudentCsvData | null>[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',').map(column => column.trim());
            
            // Skip empty rows
            if (columns.length < Math.max(nameIndex, batchIndex, boardIndex) + 1) continue;
            
            const student: StudentCsvData = {
              name: columns[nameIndex],
              batch: columns[batchIndex],
              class_id: classIndex !== -1 ? columns[classIndex] : null,
              board: columns[boardIndex],
              email: emailIndex !== -1 ? columns[emailIndex] : null
            };
            
            // Validate required fields
            if (!student.name || !student.batch || !student.board) {
              continue;
            }
            
            // If email and password are provided, create auth user
            if (emailIndex !== -1 && passwordIndex !== -1 && columns[emailIndex] && columns[passwordIndex]) {
              const email = columns[emailIndex];
              const password = columns[passwordIndex];
              
              // Register user in auth
              const authPromise = supabase.auth.signUp({
                email,
                password,
                options: {
                  data: {
                    name: student.name,
                    role: "student",
                  },
                },
              }).then(({ data, error }) => {
                if (error) {
                  console.error("Error registering student:", error);
                  return null;
                }
                
                // Add user ID to student object
                if (data.user) {
                  const studentWithId: StudentCsvData = {
                    ...student,
                    id: data.user.id
                  };
                  return studentWithId;
                }
                return null;
              });
              
              authPromises.push(authPromise);
            } else {
              // No auth data, just add student to array
              students.push(student);
            }
          }
          
          // Wait for all auth promises to resolve
          if (authPromises.length > 0) {
            const authResults = await Promise.all(authPromises);
            
            // Filter out nulls (failed registrations)
            const validAuthStudents = authResults.filter(student => student !== null) as StudentCsvData[];
            
            // Combine with regular students
            students.push(...validAuthStudents);
          }
          
          if (students.length === 0) {
            reject(new Error("No valid student data found in the CSV file"));
            return;
          }
          
          resolve(students);
        } catch (error) {
          console.error("Error processing CSV file:", error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read CSV file"));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return null;
  }
};

export const saveStudentsToDatabase = async (students: StudentCsvData[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('students')
      .insert(students);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error inserting students:", error);
    return false;
  }
};

export const downloadSampleCsv = () => {
  const sampleContent = "name,batch,class_id,board,email,password\nJohn Doe,2025,10A,CBSE,john@example.com,password123\nJane Smith,2025,10B,ICSE,jane@example.com,password456";
  const blob = new Blob([sampleContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
