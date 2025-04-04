
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-fade-in">
      {icon && <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
