
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: number;
  title: string;
  due: string;
}

interface TasksSectionProps {
  tasks: Task[];
}

export const TasksSection = ({ tasks }: TasksSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className="flex items-start pb-2 border-b last:border-0 last:pb-0">
              <div className="bg-primary/10 p-2 rounded-full mr-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-muted-foreground text-xs">Due: {task.due}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
