import type { ColumnDef } from "@tanstack/react-table";
import { TableCell, TableRow } from "../ui/table";

type NoResultsTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
};

export default function NoResultsTable<T>({ columns }: NoResultsTableProps<T>) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}
