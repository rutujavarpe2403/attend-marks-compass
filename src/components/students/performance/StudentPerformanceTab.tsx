
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MarksData } from "../types/student";

interface StudentPerformanceTabProps {
  marksData: MarksData[];
}

export const StudentPerformanceTab = ({ marksData }: StudentPerformanceTabProps) => {
  // Subject performance data
  const subjectPerformance = marksData.reduce((acc, curr) => {
    if (!acc[curr.subject_id]) {
      acc[curr.subject_id] = { total: 0, count: 0 };
    }
    acc[curr.subject_id].total += curr.marks;
    acc[curr.subject_id].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const subjectPerformanceData = Object.entries(subjectPerformance).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {marksData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectPerformanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" name="Average Score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
