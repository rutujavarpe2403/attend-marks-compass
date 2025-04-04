
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = "neutral",
}: StatsCardProps) => {
  const trendColor = 
    trendDirection === "up" ? "text-green-600" :
    trendDirection === "down" ? "text-red-600" :
    "text-muted-foreground";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && icon}
        </div>
        <div className="mt-2 flex items-baseline">
          <h3 className="text-3xl font-bold">{value}</h3>
          {trend && (
            <div className={cn("ml-2 flex items-center text-sm", trendColor)}>
              {trendDirection === "up" ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : trendDirection === "down" ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : (
                <ArrowRight className="h-3 w-3 mr-1" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
