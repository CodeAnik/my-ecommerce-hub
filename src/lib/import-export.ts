import * as XLSX from "xlsx";
import Papa from "papaparse";

export type ExportFormat = "csv" | "xlsx";

/** Trigger a file download from a Blob */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export an array of plain objects as CSV or XLSX */
export function exportRows(
  rows: Record<string, any>[],
  filenameBase: string,
  format: ExportFormat,
) {
  const stamp = new Date().toISOString().split("T")[0];
  if (format === "csv") {
    const csv = Papa.unparse(rows);
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenameBase}-${stamp}.csv`);
  } else {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    downloadBlob(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `${filenameBase}-${stamp}.xlsx`,
    );
  }
}

/** Parse a user-selected file (csv/xlsx) into plain row objects */
export function parseFile(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    const reader = new FileReader();

    if (name.endsWith(".csv")) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
        if (result.errors.length) reject(result.errors[0]);
        else resolve(result.data as Record<string, any>[]);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(ws, { defval: "" }));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file format. Use .csv, .xlsx, or .xls"));
    }
  });
}

export const FILE_ACCEPT = ".csv,.xlsx,.xls";
