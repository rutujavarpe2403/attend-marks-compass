
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceSection } from "./AttendanceSection";
import { MarksSection } from "./MarksSection";
import { AttendanceRecord, MarkRecord } from "./types";

interface DashboardTabsProps {
  recentAttendanceData: AttendanceRecord[];
  recentMarksData: MarkRecord[];
}

export const DashboardTabs = ({ recentAttendanceData, recentMarksData }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="attendance" className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Attendance Details</span>
          </TabsTrigger>
          <TabsTrigger value="marks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Recent Marks</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="attendance" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Detailed Attendance Records</CardTitle>
            <CardDescription>
              Complete overview of attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceSection recentAttendanceData={recentAttendanceData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="marks" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Mark Entries</CardTitle>
            <CardDescription>
              Overview of the most recent mark entries and submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarksSection recentMarksData={recentMarksData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
