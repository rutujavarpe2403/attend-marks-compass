
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface StudentAttendanceTabProps {
  attendanceSummary: {
    present: number;
    absent: number;
    percentage: number;
  };
}

export const StudentAttendanceTab = ({ attendanceSummary }: StudentAttendanceTabProps) => {
  // Attendance pie chart data
  const attendancePieData = [
    { name: 'Present', value: attendanceSummary.present, color: '#10b981' },
    { name: 'Absent', value: attendanceSummary.absent, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
            <p className="text-2xl font-bold">{attendanceSummary.percentage}%</p>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-sm font-medium text-muted-foreground">Days Present</p>
            <p className="text-2xl font-bold">{attendanceSummary.present}</p>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-sm font-medium text-muted-foreground">Days Absent</p>
            <p className="text-2xl font-bold">{attendanceSummary.absent}</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendancePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {attendancePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
