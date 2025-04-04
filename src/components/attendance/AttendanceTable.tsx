
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, Download, FileSpreadsheet, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";

export const AttendanceTable = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isTeacher = user?.role === "teacher";

  // Mock data - in a real app, these would come from an API call
  const classesList = ["10A", "10B", "11C", "12A", "9B"];
  
  const studentData = [
    {
      id: "s1",
      name: "Alex Johnson",
      class: "10A",
      roll: "101",
      status: "present",
      attendance: { "2025-04-04": "present", "2025-04-03": "present", "2025-04-02": "absent", "2025-04-01": "present" },
    },
    {
      id: "s2",
      name: "Emma Wilson",
      class: "10A",
      roll: "102",
      status: "absent",
      attendance: { "2025-04-04": "absent", "2025-04-03": "present", "2025-04-02": "present", "2025-04-01": "present" },
    },
    {
      id: "s3",
      name: "Noah Garcia",
      class: "10B",
      roll: "103",
      status: "present",
      attendance: { "2025-04-04": "present", "2025-04-03": "absent", "2025-04-02": "present", "2025-04-01": "present" },
    },
    {
      id: "s4",
      name: "Sophia Martinez",
      class: "11C",
      roll: "104",
      status: "late",
      attendance: { "2025-04-04": "late", "2025-04-03": "present", "2025-04-02": "present", "2025-04-01": "late" },
    },
    {
      id: "s5",
      name: "Liam Taylor",
      class: "12A",
      roll: "105",
      status: "present",
      attendance: { "2025-04-04": "present", "2025-04-03": "present", "2025-04-02": "present", "2025-04-01": "present" },
    },
    {
      id: "s6",
      name: "Jane Doe",
      class: "10A",
      roll: "106",
      status: "present",
      attendance: { "2025-04-04": "present", "2025-04-03": "absent", "2025-04-02": "present", "2025-04-01": "present" },
    },
  ];

  // If student, filter to just show their own record
  // In a real app, this would be done at the API level
  const filteredStudents = user?.role === "student" 
    ? studentData.filter(s => s.name === "Jane Doe") // Mock student view
    : studentData.filter(student => 
        (selectedClass === "all" || student.class === selectedClass) &&
        (searchQuery === "" || 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.roll.includes(searchQuery))
      );

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return format(date, "PPP");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
  };

  const handleStatusChange = (studentId: string, newStatus: string) => {
    // In a real app, this would call an API to update the status
    toast.success(`Updated status for student #${studentId} to ${newStatus}`);
  };

  const handleExportData = () => {
    toast.success("Attendance data exported successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-50 border-green-200";
      case "absent":
        return "text-red-600 bg-red-50 border-red-200";
      case "late":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground">
            {isTeacher 
              ? "Track and manage student attendance records" 
              : "View your attendance records"}
          </p>
        </div>
        {isTeacher && (
          <div className="flex space-x-2">
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
            {isTeacher ? "Student Attendance" : "My Attendance"}
          </CardTitle>
          <CardDescription>
            {isTeacher 
              ? "Mark and manage student attendance records" 
              : "View your attendance history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal sm:w-[240px]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {isTeacher && (
                <>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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

                  <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name or roll number..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left">
                      {isTeacher && <th className="h-10 px-4 font-medium">Roll No</th>}
                      <th className="h-10 px-4 font-medium">Student Name</th>
                      {isTeacher && <th className="h-10 px-4 font-medium">Class</th>}
                      <th className="h-10 px-4 font-medium">Status</th>
                      {isTeacher && <th className="h-10 px-4 font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      // In a real app, we'd use the selected date to look up attendance
                      const formattedDate = date ? format(date, "yyyy-MM-dd") : "2025-04-04";
                      const status = student.attendance[formattedDate] || "unknown";
                      
                      return (
                        <tr key={student.id} className="border-b transition-colors hover:bg-muted/50">
                          {isTeacher && <td className="p-4">{student.roll}</td>}
                          <td className="p-4 font-medium">{student.name}</td>
                          {isTeacher && <td className="p-4">{student.class}</td>}
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          {isTeacher && (
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-600"
                                  onClick={() => handleStatusChange(student.id, "present")}
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Present</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600"
                                  onClick={() => handleStatusChange(student.id, "absent")}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Absent</span>
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={isTeacher ? 5 : 3} className="h-24 text-center">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="monthly">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        <TabsContent value="daily" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Summary</CardTitle>
              <CardDescription>
                Summary of attendance for the selected date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Present</div>
                    <div className="text-2xl font-bold text-green-600">28</div>
                    <div className="text-xs text-muted-foreground">93% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Absent</div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-xs text-muted-foreground">7% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Late</div>
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-xs text-muted-foreground">0% of students</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Summary</CardTitle>
              <CardDescription>
                Summary of attendance for the current week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Present</div>
                    <div className="text-2xl font-bold text-green-600">134</div>
                    <div className="text-xs text-muted-foreground">89% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Absent</div>
                    <div className="text-2xl font-bold text-red-600">14</div>
                    <div className="text-xs text-muted-foreground">9% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Late</div>
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-xs text-muted-foreground">2% of students</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Summary</CardTitle>
              <CardDescription>
                Summary of attendance for the current month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Present</div>
                    <div className="text-2xl font-bold text-green-600">552</div>
                    <div className="text-xs text-muted-foreground">92% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Absent</div>
                    <div className="text-2xl font-bold text-red-600">36</div>
                    <div className="text-xs text-muted-foreground">6% of students</div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="text-xs font-medium text-muted-foreground">Late</div>
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-xs text-muted-foreground">2% of students</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
