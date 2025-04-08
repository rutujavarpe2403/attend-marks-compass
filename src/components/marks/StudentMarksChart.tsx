
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  ResponsiveContainer 
} from "recharts";
import { MarksRecord } from "./TeacherMarksView";
import { Button } from "@/components/ui/button";

interface StudentMarksChartProps {
  marks: MarksRecord[];
}

export const StudentMarksChart = ({ marks }: StudentMarksChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  
  // Process data for bar chart - by subject
  const subjectData = marks.reduce((acc, mark) => {
    const existingSubject = acc.find(item => item.subject === mark.subject_id);
    
    if (existingSubject) {
      existingSubject.marks = (existingSubject.marks * existingSubject.count + mark.marks) / (existingSubject.count + 1);
      existingSubject.count += 1;
    } else {
      acc.push({
        subject: mark.subject_id,
        marks: mark.marks,
        count: 1
      });
    }
    
    return acc;
  }, [] as { subject: string; marks: number; count: number }[]);
  
  // Process data for pie chart - by exam type
  const examTypeData = marks.reduce((acc, mark) => {
    const existingType = acc.find(item => item.name === mark.exam_type);
    
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({
        name: mark.exam_type,
        value: 1
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 mb-6">
        <Button 
          variant={chartType === "bar" ? "default" : "outline"} 
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </Button>
        <Button 
          variant={chartType === "pie" ? "default" : "outline"} 
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {chartType === "bar" ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="marks" name="Average Marks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={examTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {examTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
