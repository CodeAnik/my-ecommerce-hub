import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface RepeaterFieldProps<T> {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, idx: number) => React.ReactNode;
  addLabel?: string;
  emptyText?: string;
}

export function RepeaterField<T extends { id: string }>({ items, onChange, newItem, renderItem, addLabel = "Add item", emptyText = "No items yet" }: RepeaterFieldProps<T>) {
  const update = (idx: number, patch: Partial<T>) => {
    onChange(items.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, newItem()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground italic">{emptyText}</p>}
      {items.map((it, i) => (
        <div key={it.id} className="relative p-4 rounded-lg border bg-muted/30 space-y-3">
          <button type="button" onClick={() => remove(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 rounded transition-colors" aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </button>
          {renderItem(it, (patch) => update(i, patch), i)}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> {addLabel}
      </Button>
    </div>
  );
}
