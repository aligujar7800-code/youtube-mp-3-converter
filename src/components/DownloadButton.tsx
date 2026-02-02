import { Download, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  fileName: string;
  fileSize: string;
  onDownload: () => void;
}

export function DownloadButton({ fileName, fileSize, onDownload }: DownloadButtonProps) {
  return (
    <div className="w-full animate-slide-up">
      <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <FileAudio className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">{fileSize}</p>
          </div>
        </div>
        
        <Button 
          variant="success" 
          size="lg" 
          className="w-full"
          onClick={onDownload}
        >
          <Download className="h-5 w-5" />
          Download MP3
        </Button>
      </div>
    </div>
  );
}
