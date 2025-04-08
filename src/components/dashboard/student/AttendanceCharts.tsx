
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AttendanceSummary, ChartData } from "./types";

interface AttendanceChartsProps {
  attendanceSummary: AttendanceSummary;
}

export const AttendanceCharts = ({ attendanceSummary }: AttendanceChartsProps) => {
  const [activeChartType, setActiveChartType] = useState<"bar" | "pie">("bar");

  // Chart data for attendance
  const pieChartData: ChartData[] = [
    { name: 'Present', value: attendanceSummary.present, color: '#86efac' }, // light green
    { name: 'Absent', value: attendanceSummary.absent, color: '#fca5a5' }, // light red
  ];

  // Bar chart data by slot
  const barChartData = [
    {
      name: 'Morning',
      Present: attendanceSummary.bySlot.morning.present,
      Absent: attendanceSummary.bySlot.morning.absent,
    },
    {
      name: 'Afternoon',
      Present: attendanceSummary.bySlot.afternoon.present,
      Absent: attendanceSummary.bySlot.afternoon.absent,
    },
    {
      name: 'Evening',
      Present: attendanceSummary.bySlot.evening.present,
      Absent: attendanceSummary.bySlot.evening.absent,
    },
  ];

  return (
    <Tabs value={activeChartType} onValueChange={(value) => setActiveChartType(value as "bar" | "pie")} className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
        <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bar">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#86efac" /> {/* light green */}
              <Bar dataKey="Absent" fill="#fca5a5" /> {/* light red */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="pie">
        <div className="h-64">
          <AttendancePieChart data={pieChartData} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

interface AttendancePieChartProps {
  data: ChartData[];
}

const AttendancePieChart = ({ data }: AttendancePieChartProps) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);
