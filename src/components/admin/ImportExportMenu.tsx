import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Upload, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { exportRows, parseFile, FILE_ACCEPT, type ExportFormat } from "@/lib/import-export";

interface Props {
  /** Filename prefix, e.g. "orders" → orders-2026-04-19.csv */
  filenameBase: string;
  /** Builder returning the row objects to export (called on click so latest data is used). */
  getExportRows: () => Record<string, any>[];
  /** Called with parsed rows from imported file. Return number of rows imported (or void). */
  onImport: (rows: Record<string, any>[]) => number | void;
  label?: string;
}

export function ImportExportMenu({ filenameBase, getExportRows, onImport, label }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = (format: ExportFormat) => {
    const rows = getExportRows();
    if (!rows.length) {
      toast.error("Nothing to export");
      return;
    }
    exportRows(rows, filenameBase, format);
    toast.success(`Exported ${rows.length} rows as ${format.toUpperCase()}`);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const rows = await parseFile(file);
      if (!rows.length) {
        toast.error("File is empty");
        return;
      }
      const count = onImport(rows);
      toast.success(`Imported ${typeof count === "number" ? count : rows.length} rows`);
    } catch (err: any) {
      toast.error(`Import failed: ${err?.message || "invalid file"}`);
    }
  };

  return (
    <>
      <input ref={fileRef} type="file" accept={FILE_ACCEPT} className="hidden" onChange={handleFile} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label || "Import / Export"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs">Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => doExport("csv")}>
            <FileText className="h-3.5 w-3.5 mr-2" /> Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => doExport("xlsx")}>
            <FileSpreadsheet className="h-3.5 w-3.5 mr-2" /> Export as Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">Import</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => fileRef.current?.click()}>
            <Upload className="h-3.5 w-3.5 mr-2" /> Import CSV / Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
