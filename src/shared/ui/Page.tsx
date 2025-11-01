import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageProps {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Page({ title, description, toolbar, children, className }: PageProps) {
  return (
    <div className={cn("p-6 space-y-6", className)}>
      {(title || toolbar) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
