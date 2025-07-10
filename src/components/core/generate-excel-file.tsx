import * as XLSX from "xlsx";
import { Button } from "../ui/button";
import { useId } from "react";
import { FileSpreadsheet } from "lucide-react";

export function exportTableToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename = "table-data.xlsx",
) {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}

type ExportTableDataToExcelProps<T> = {
  data: T[];
  filename?: string;
};

export function ExportTableDataToExcel<T extends Record<string, unknown>>({
  data,
  filename = "table-data.xlsx",
}: ExportTableDataToExcelProps<T>) {
  const id = useId();

  return (
    <Button
      id={id}
      variant="outline"
      className="h-9 border-muted border-[1px]"
      onClick={() => exportTableToExcel(data, filename)}
      disabled={data.length === 0}
    >
      <FileSpreadsheet className="w-4 h-4" />
      Export
    </Button>
  );
}
