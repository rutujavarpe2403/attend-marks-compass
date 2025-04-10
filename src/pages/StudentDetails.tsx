import { useParams } from "react-router-dom";
import { StudentDetailsView } from "@/components/students/StudentDetailsView";

const StudentDetails = () => {
  const { studentId } = useParams<{ studentId: string }>();
  
  if (!studentId) {
    return <div>Student ID not provided</div>;
  }
  
  return <StudentDetailsView studentId={studentId} />;
};

export default StudentDetails; 
