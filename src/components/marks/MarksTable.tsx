
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Download, FileSpreadsheet, FileUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";

export const MarksTable = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isTeacher = user?.role === "teacher";

  // Mock data - in a real app, these would come from an API call
  const classesList = ["10A", "10B", "11C", "12A", "9B"];
  const subjectsList = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
  const examTypesList = ["Midterm", "Final", "Quiz", "Assignment", "Project"];
  
  const studentMarksData = [
    {
      id: "s1",
      name: "Alex Johnson",
      class: "10A",
      roll: "101",
      subject: "Mathematics",
      examType: "Midterm",
      marks: 92,
      totalMarks: 100,
      grade: "A",
      date: "2025-03-15",
    },
    {
      id: "s2",
      name: "Emma Wilson",
      class: "10A",
      roll: "102",
      subject: "Mathematics",
      examType: "Midterm",
      marks: 85,
      totalMarks: 100,
      grade: "B+",
      date: "2025-03-15",
    },
    {
      id: "s3",
      name: "Noah Garcia",
      class: "10B",
      roll: "103",
      subject: "Physics",
      examType: "Quiz",
      marks: 78,
      totalMarks: 100,
      grade: "C+",
      date: "2025-03-22",
    },
    {
      id: "s4",
      name: "Sophia Martinez",
      class: "11C",
      roll: "104",
      subject: "English",
      examType: "Assignment",
      marks: 95,
      totalMarks: 100,
      grade: "A",
      date: "2025-03-18",
    },
    {
      id: "s5",
      name: "Liam Taylor",
      class: "12A",
      roll: "105",
      subject: "Chemistry",
      examType: "Final",
      marks: 88,
      totalMarks: 100,
      grade: "B+",
      date: "2025-03-28",
    },
    {
      id: "s6",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      subject: "Mathematics",
      examType: "Midterm",
      marks: 90,
      totalMarks: 100,
      grade: "A-",
      date: "2025-03-15",
    },
    {
      id: "s7",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      subject: "Physics",
      examType: "Quiz",
      marks: 85,
      totalMarks: 100,
      grade: "B+",
      date: "2025-03-22",
    },
    {
      id: "s8",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      subject: "English",
      examType: "Essay",
      marks: 88,
      totalMarks: 100,
      grade: "B+",
      date: "2025-03-18",
    },
    {
      id: "s9",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      subject: "Chemistry",
      examType: "Lab Report",
      marks: 95,
      totalMarks: 100,
      grade: "A",
      date: "2025-03-25",
    },
    {
      id: "s10",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      subject: "History",
      examType: "Project",
      marks: 78,
      totalMarks: 100,
      grade: "C+",
      date: "2025-03-10",
    },
  ];

  // If student, filter to just show their own record
  // In a real app, this would be done at the API level
  const filteredMarks = user?.role === "student" 
    ? studentMarksData.filter(s => s.name === "Jane Doe") // Mock student view
    : studentMarksData.filter(mark => 
        (selectedClass === "all" || mark.class === selectedClass) &&
        (selectedSubject === "all" || mark.subject === selectedSubject) &&
        (selectedExamType === "all" || mark.examType === selectedExamType) &&
        (searchQuery === "" || 
          mark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mark.roll.includes(searchQuery))
      );

  const handleExportData = () => {
    toast.success("Marks data exported successfully!");
  };

  const handleUploadCSV = () => {
    // In a real app, this would open a file dialog and process the CSV
    toast.success("CSV upload feature would be implemented here!");
  };

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case "A":
        return "text-green-600";
      case "B":
        return "text-blue-600";
      case "C":
        return "text-yellow-600";
      case "D":
        return "text-orange-600";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marks Management</h2>
          <p className="text-muted-foreground">
            {isTeacher 
              ? "Track and manage student marks and grades" 
              : "View your marks and grades"}
          </p>
        </div>
        {isTeacher && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleUploadCSV}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isTeacher ? "Student Marks" : "My Academic Performance"}
          </CardTitle>
          <CardDescription>
            {isTeacher 
              ? "View and manage student marks across subjects and exams" 
              : "Track your academic performance across subjects"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
              {isTeacher && (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classesList.map((className) => (
                      <SelectItem key={className} value={className}>
                        Class {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjectsList.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypesList.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isTeacher && (
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or roll number..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>

            {filteredMarks.length > 0 ? (
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr className="text-left">
                        {isTeacher && <th className="h-10 px-4 font-medium">Roll No</th>}
                        {isTeacher && <th className="h-10 px-4 font-medium">Student Name</th>}
                        <th className="h-10 px-4 font-medium">Subject</th>
                        <th className="h-10 px-4 font-medium">Exam Type</th>
                        <th className="h-10 px-4 font-medium">Marks</th>
                        <th className="h-10 px-4 font-medium">Grade</th>
                        <th className="h-10 px-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMarks.map((mark) => (
                        <tr key={mark.id} className="border-b transition-colors hover:bg-muted/50">
                          {isTeacher && <td className="p-4">{mark.roll}</td>}
                          {isTeacher && <td className="p-4 font-medium">{mark.name}</td>}
                          <td className="p-4">{mark.subject}</td>
                          <td className="p-4">{mark.examType}</td>
                          <td className="p-4">{mark.marks}/{mark.totalMarks}</td>
                          <td className={`p-4 font-medium ${getGradeColor(mark.grade)}`}>{mark.grade}</td>
                          <td className="p-4">{mark.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={<BookOpen className="h-10 w-10" />}
                title="No marks found"
                description="No marks data matching your criteria was found."
                action={isTeacher && (
                  <Button onClick={handleUploadCSV}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Marks Data
                  </Button>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="subject">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="subject">Subject-wise</TabsTrigger>
            <TabsTrigger value="exam">Exam-wise</TabsTrigger>
            {isTeacher && <TabsTrigger value="class">Class-wise</TabsTrigger>}
          </TabsList>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <TabsContent value="subject" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>
                Academic performance breakdown by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjectsList.slice(0, 3).map((subject) => (
                  <div key={subject} className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-sm font-medium">{subject}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold">
                        {subject === "Mathematics" ? "90" : 
                         subject === "Physics" ? "85" : "88"}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Grade: {subject === "Mathematics" ? "A-" : 
                              subject === "Physics" ? "B+" : "B+"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exam" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam-wise Performance</CardTitle>
              <CardDescription>
                Academic performance breakdown by exam type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {examTypesList.slice(0, 3).map((examType) => (
                  <div key={examType} className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-sm font-medium">{examType}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold">
                        {examType === "Midterm" ? "88" : 
                         examType === "Final" ? "92" : "85"}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {examType === "Midterm" ? "3 subjects" : 
                       examType === "Final" ? "2 subjects" : "4 subjects"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isTeacher && (
          <TabsContent value="class" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Class-wise Performance</CardTitle>
                <CardDescription>
                  Academic performance breakdown by class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {classesList.slice(0, 3).map((className) => (
                    <div key={className} className="flex flex-col gap-1 rounded-lg border p-4">
                      <div className="text-sm font-medium">Class {className}</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">
                          {className === "10A" ? "86" : 
                           className === "10B" ? "82" : "90"}
                        </div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {className === "10A" ? "30 students" : 
                         className === "10B" ? "28 students" : "25 students"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
