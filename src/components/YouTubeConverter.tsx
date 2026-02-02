import { useState, useCallback } from "react";
import { Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlInput } from "./UrlInput";
import { QualitySelector } from "./QualitySelector";
import { ConversionProgress } from "./ConversionProgress";
import { DownloadButton } from "./DownloadButton";
import { ConversionHistory } from "./ConversionHistory";
import { useToast } from "@/hooks/use-toast";

type ConversionStatus = "idle" | "fetching" | "converting" | "complete" | "error";

interface HistoryItem {
  id: string;
  title: string;
  quality: string;
  timestamp: Date;
}

// YouTube URL validation
const isValidYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
  ];
  return patterns.some((pattern) => pattern.test(url.trim()));
};

export function YouTubeConverter() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("192");
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  const handleConvert = useCallback(async () => {
    // Validate URL
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setError("");
    setStatus("fetching");
    setProgress(10);

    try {
      const response = await fetch("http://localhost:8000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, quality }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : "Conversion failed. Please check the backend logs.";
        throw new Error(errorMessage);
      }

      setStatus("converting");
      setProgress(60);

      const data = await response.json();
      setVideoTitle(data.info.title);
      setDownloadUrl(`http://localhost:8000${data.download_url}`);
      setProgress(100);
      setStatus("complete");

      // Add to history
      const newItem: HistoryItem = {
        id: data.filename,
        title: data.info.title,
        quality,
        timestamp: new Date(),
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 5));

      toast({
        title: "Conversion Complete!",
        description: "Your MP3 is ready to download.",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during conversion");
      setStatus("error");
      toast({
        title: "Error",
        description: err.message || "Failed to convert video.",
        variant: "destructive",
      });
    }
  }, [url, quality, toast]);

  const handleDownload = useCallback((filename?: string | any) => {
    // If filename is a React event object, ignore it and use the default downloadUrl
    const actualFilename = typeof filename === 'string' ? filename : undefined;
    const finalUrl = actualFilename ? `http://localhost:8000/download/${actualFilename}` : downloadUrl;
    
    if (finalUrl) {
      window.location.href = finalUrl;
      toast({
        title: "Download Started",
        description: "Your MP3 file is being downloaded.",
      });
    }
  }, [downloadUrl, toast]);

  const handleReset = useCallback(() => {
    setUrl("");
    setStatus("idle");
    setProgress(0);
    setVideoTitle("");
    setError("");
  }, []);

  const isConverting = status === "fetching" || status === "converting";

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-button mb-4">
          <Headphones className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          YouTube to MP3
        </h1>
        <p className="text-muted-foreground">
          Convert any YouTube video to high-quality MP3 audio
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 sm:p-8 space-y-6">
        {status === "complete" ? (
          <>
            <ConversionProgress status={status} progress={progress} videoTitle={videoTitle} />
            <DownloadButton 
              fileName={`${videoTitle}.mp3`}
              fileSize={`${(Math.random() * 5 + 3).toFixed(1)} MB`}
              onDownload={handleDownload}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleReset}
            >
              Convert Another Video
            </Button>
          </>
        ) : (
          <>
            <UrlInput
              value={url}
              onChange={(value) => {
                setUrl(value);
                setError("");
              }}
              onSubmit={handleConvert}
              disabled={isConverting}
              error={error}
            />

            <QualitySelector
              value={quality}
              onChange={setQuality}
              disabled={isConverting}
            />

            {isConverting ? (
              <ConversionProgress status={status} progress={progress} videoTitle={videoTitle} />
            ) : (
              <Button 
                variant="gradient" 
                size="xl" 
                className="w-full"
                onClick={handleConvert}
                disabled={!url.trim()}
              >
                <Sparkles className="h-5 w-5" />
                Convert to MP3
              </Button>
            )}
          </>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && status !== "complete" && (
        <div className="mt-8">
          <ConversionHistory items={history} onDownload={handleDownload} />
        </div>
      )}

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        Make sure you have the backend running at http://localhost:8000
      </p>
    </div>
  );
}
