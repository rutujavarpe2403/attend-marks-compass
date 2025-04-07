
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface AttendanceBySlot {
  morning: { present: number; absent: number };
  afternoon: { present: number; absent: number };
  evening: { present: number; absent: number };
}

interface AttendanceChartProps {
  attendanceBySlot: AttendanceBySlot;
}

export const AttendanceChart = ({ attendanceBySlot }: AttendanceChartProps) => {
  // Transform the data for the chart
  const chartData = [
    {
      name: "Morning",
      Present: attendanceBySlot.morning.present,
      Absent: attendanceBySlot.morning.absent,
    },
    {
      name: "Afternoon",
      Present: attendanceBySlot.afternoon.present,
      Absent: attendanceBySlot.afternoon.absent,
    },
    {
      name: "Evening",
      Present: attendanceBySlot.evening.present,
      Absent: attendanceBySlot.evening.absent,
    },
  ];

  const chartConfig = {
    Present: {
      label: "Present",
      theme: {
        light: "#86efac", // lighter green
        dark: "#4ade80",
      },
    },
    Absent: {
      label: "Absent",
      theme: {
        light: "#fca5a5", // lighter red
        dark: "#f87171",
      },
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="Present" fill="var(--color-Present)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Absent" fill="var(--color-Absent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
