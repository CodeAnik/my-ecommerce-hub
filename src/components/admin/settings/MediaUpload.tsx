import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface MediaUploadProps {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  aspect?: "square" | "video" | "wide" | "tall";
  maxSizeMB?: number;
}

const ASPECT: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  tall: "aspect-[3/4]",
};

export function MediaUpload({ value, onChange, label, aspect = "video", maxSizeMB = 2 }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (file.size > maxSizeMB * 1024 * 1024) { toast.error(`Image must be under ${maxSizeMB}MB`); return; }
    const reader = new FileReader();
    reader.onload = e => onChange((e.target?.result as string) || "");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className={`relative ${ASPECT[aspect]} w-full rounded-lg border-2 border-dashed border-border bg-muted/30 overflow-hidden group`}>
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Replace
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onChange("")}>
                <X className="h-3.5 w-3.5 mr-1.5" /> Remove
              </Button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs font-medium">Click to upload</span>
            <span className="text-[10px]">PNG, JPG up to {maxSizeMB}MB</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}
