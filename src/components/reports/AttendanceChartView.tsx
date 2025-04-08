
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface DateData {
  date: string;
  present: number;
  absent: number;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  percentage: number;
}

interface AttendanceChartViewProps {
  attendanceData: {
    summary: AttendanceSummary;
    byDate: DateData[];
  };
}

export const AttendanceChartView = ({ attendanceData }: AttendanceChartViewProps) => {
  // Pie chart data for attendance summary - using lighter colors
  const pieChartData = [
    { name: "Present", value: attendanceData.summary.present, color: "#86efac" }, // light green
    { name: "Absent", value: attendanceData.summary.absent, color: "#fca5a5" }, // light red
  ];

  // Bar chart data for attendance by date
  const barChartData = attendanceData.byDate.map(item => ({
    date: format(new Date(item.date), "MMM dd"),
    present: item.present,
    absent: item.absent,
  }));

  return (
    <Tabs defaultValue="pie" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
        <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
      </TabsList>

      <TabsContent value="pie">
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Attendance Rate: {attendanceData.summary.percentage}%</p>
          <p className="text-sm text-muted-foreground">
            {attendanceData.summary.present} sessions present, {attendanceData.summary.absent} sessions absent
          </p>
        </div>
      </TabsContent>

      <TabsContent value="bar">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#86efac" /> {/* light green */}
              <Bar dataKey="absent" name="Absent" fill="#fca5a5" /> {/* light red */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
};
