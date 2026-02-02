import { Clock, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  title: string;
  quality: string;
  timestamp: Date;
}

interface ConversionHistoryProps {
  items: HistoryItem[];
  onDownload: (id: string) => void;
}

export function ConversionHistory({ items, onDownload }: ConversionHistoryProps) {
  if (items.length === 0) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Recent Conversions</span>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Music className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.quality} kbps • {formatTime(item.timestamp)}
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDownload(item.id)}
              className="flex-shrink-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
