import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className,
  showPercentage = true,
  label
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{label}</span>
          {showPercentage && (
            <span className="text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `진행률 ${percentage}%`}
        />
      </div>
    </div>
  );
}
