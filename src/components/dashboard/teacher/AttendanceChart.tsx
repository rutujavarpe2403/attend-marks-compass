import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AttendanceBySlot } from "./types";

interface AttendanceChartProps {
  attendanceBySlot: AttendanceBySlot;
}

export const AttendanceChart = ({ attendanceBySlot }: AttendanceChartProps) => {
  const data = Object.entries(attendanceBySlot).map(([slot, counts]) => ({
    slot,
    present: counts.present,
    absent: counts.absent,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="slot"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{ value: "Number of Students", angle: -90, position: "insideLeft", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Legend />
        <Bar dataKey="present" name="Present" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" name="Absent" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
