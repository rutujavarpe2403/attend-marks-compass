import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getStudentDetails } from '@/lib/api';

interface StudentDetailsViewProps {
  studentId: string;
}

export const StudentDetailsView: React.FC<StudentDetailsViewProps> = ({ studentId }) => {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentDetails(studentId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load student details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!student) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Student not found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{student.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
              <p className="text-lg">{student.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p className="text-lg">{student.class}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Section</p>
              <p className="text-lg">{student.section}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg">{student.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
              <p className="text-lg">{student.attendance}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Marks</p>
              <p className="text-lg">{student.averageMarks}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
