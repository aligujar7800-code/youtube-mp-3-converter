import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Music2 } from "lucide-react";

interface QualitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const qualities = [
  { value: "128", label: "128 kbps", description: "Good quality, smaller file" },
  { value: "192", label: "192 kbps", description: "Better quality" },
  { value: "320", label: "320 kbps", description: "Best quality" },
];

export function QualitySelector({ value, onChange, disabled }: QualitySelectorProps) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-muted-foreground mb-2 block">
        Audio Quality
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full h-12 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select quality" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {qualities.map((quality) => (
            <SelectItem 
              key={quality.value} 
              value={quality.value}
              className="rounded-lg cursor-pointer"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{quality.label}</span>
                <span className="text-xs text-muted-foreground">{quality.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
