import { useState } from "react";
import { Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string;
}

export function UrlInput({ value, onChange, onSubmit, disabled, error }: UrlInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "relative flex items-center w-full rounded-xl border-2 bg-card transition-all duration-200",
          isFocused ? "border-primary shadow-lg shadow-primary/10" : "border-border",
          error && "border-destructive",
          disabled && "opacity-60"
        )}
      >
        <div className="flex items-center justify-center pl-4 text-muted-foreground">
          <Link2 className="h-5 w-5" />
        </div>
        
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Paste YouTube URL here..."
          className="flex-1 h-14 px-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
        />

        {value ? (
          <button
            onClick={() => onChange("")}
            disabled={disabled}
            className="flex items-center justify-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handlePaste}
            disabled={disabled}
            className="flex items-center justify-center pr-4 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Paste
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive animate-fade-in px-1">{error}</p>
      )}
    </div>
  );
}
