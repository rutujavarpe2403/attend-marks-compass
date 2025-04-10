import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from "recharts";
import { AttendanceBySlot } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface AttendanceChartProps {
  attendanceBySlot: AttendanceBySlot;
}

export const AttendanceChart = ({ attendanceBySlot }: AttendanceChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const data = Object.entries(attendanceBySlot).map(([slot, counts]) => {
    const total = counts.present + counts.absent;
    const presentPercentage = total > 0 ? Math.round((counts.present / total) * 100) : 0;
    return {
      slot: slot.charAt(0).toUpperCase() + slot.slice(1), // Capitalize first letter
      present: counts.present,
      absent: counts.absent,
      presentPercentage,
    };
  });

  // Prepare data for pie chart
  const pieChartData = data.map(item => [
    { name: `${item.slot} - Present`, value: item.present },
    { name: `${item.slot} - Absent`, value: item.absent }
  ]).flat();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value + payload[1].value;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="font-semibold text-gray-700">{label}</p>
          <p className="text-sm text-gray-600">
            Present: {payload[0].value} ({payload[0].payload.presentPercentage}%)
          </p>
          <p className="text-sm text-gray-600">
            Absent: {payload[1].value}
          </p>
          <p className="text-sm text-gray-600">
            Total: {total}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="font-semibold text-gray-700">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Lighter colors for both charts
  const colors = {
    present: "#86efac", // light green
    absent: "#fca5a5", // light red
  };

  return (
    <div className="w-full">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as "bar" | "pie")} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
          <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <div className="w-full h-[400px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
                barSize={40}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="slot"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  label={{ 
                    value: "Number of Students", 
                    angle: -90, 
                    position: "insideLeft", 
                    fontSize: 12,
                    fill: '#6b7280'
                  }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="present" name="Present" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`present-${index}`} fill={colors.present} />
                  ))}
                </Bar>
                <Bar dataKey="absent" name="Absent" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`absent-${index}`} fill={colors.absent} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="pie">
          <div className="w-full h-[400px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name.includes("Present") ? colors.present : colors.absent} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
