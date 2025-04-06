
import { Users, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Alert {
  id: number;
  student: string;
  class: string;
  days: number;
  status: string;
}

interface AbsenceAlertsSectionProps {
  alerts: Alert[];
}

export const AbsenceAlertsSection = ({ alerts }: AbsenceAlertsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <XCircle className="h-4 w-4" />
          Absence Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {alerts.map(alert => (
            <li key={alert.id} className="flex items-start pb-2 border-b last:border-0 last:pb-0">
              <div className="bg-destructive/10 p-2 rounded-full mr-2">
                <Users className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{alert.student} ({alert.class})</p>
                <p className="text-muted-foreground text-xs">
                  {alert.days} days absent • {alert.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
