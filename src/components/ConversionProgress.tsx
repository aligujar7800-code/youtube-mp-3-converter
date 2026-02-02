import { Loader2, CheckCircle2, Music } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ConversionProgressProps {
  status: "idle" | "fetching" | "converting" | "complete" | "error";
  progress: number;
  videoTitle?: string;
}

const statusMessages = {
  idle: "",
  fetching: "Fetching video information...",
  converting: "Converting to MP3...",
  complete: "Conversion complete!",
  error: "Conversion failed",
};

export function ConversionProgress({ status, progress, videoTitle }: ConversionProgressProps) {
  if (status === "idle") return null;

  return (
    <div className="w-full space-y-4 animate-slide-up">
      {/* Video Title */}
      {videoTitle && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-2">{videoTitle}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === "complete" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : status === "error" ? (
              <div className="h-4 w-4 rounded-full bg-destructive" />
            ) : (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            )}
            <span className={cn(
              "text-sm font-medium",
              status === "complete" && "text-emerald-500",
              status === "error" && "text-destructive"
            )}>
              {statusMessages[status]}
            </span>
          </div>
          {status !== "error" && (
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className={cn(
            "h-2",
            status === "complete" && "[&>div]:bg-emerald-500",
            status === "error" && "[&>div]:bg-destructive"
          )}
        />
      </div>
    </div>
  );
}
