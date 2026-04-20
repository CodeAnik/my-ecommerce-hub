import { useState } from "react";
import { HslColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorFieldProps {
  label: string;
  /** HSL triplet string like "230 80% 56%" */
  value: string;
  onChange: (next: string) => void;
}

function parseHsl(v: string): { h: number; s: number; l: number } {
  const m = v.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return { h: 230, s: 80, l: 56 };
  return { h: +m[1], s: +m[2], l: +m[3] };
}
function formatHsl(c: { h: number; s: number; l: number }) {
  return `${Math.round(c.h)} ${Math.round(c.s)}% ${Math.round(c.l)}%`;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [open, setOpen] = useState(false);
  const c = parseHsl(value);
  const css = `hsl(${value})`;
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="h-10 w-10 rounded-md border border-border shadow-sm shrink-0"
              style={{ backgroundColor: css }} aria-label={`Pick ${label}`} />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <HslColorPicker color={c} onChange={(n) => onChange(formatHsl(n))} />
          </PopoverContent>
        </Popover>
        <Input value={value} onChange={e => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  );
}
