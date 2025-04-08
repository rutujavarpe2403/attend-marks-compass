
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

interface MarksChartViewProps {
  marksData: {
    bySubject: { subject: string; average: number }[];
    byExamType: { name: string; value: number; color: string }[];
  };
}

export const MarksChartView = ({ marksData }: MarksChartViewProps) => {
  return (
    <Tabs defaultValue="bar" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="bar" className="flex-1">Bar Chart</TabsTrigger>
        <TabsTrigger value="pie" className="flex-1">Pie Chart</TabsTrigger>
      </TabsList>

      <TabsContent value="bar">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={marksData.bySubject}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" name="Average Marks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="pie">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marksData.byExamType}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {marksData.byExamType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Distribution of exam types
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
