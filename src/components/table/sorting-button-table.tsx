import { ArrowDownUp, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import type { Column } from "@tanstack/react-table";

type SortingTableButtonProps<T> = {
  label: string;
  column: Column<T, unknown>;
};

export default function SortingTableButton<T>({
  label,
  column,
}: SortingTableButtonProps<T>) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      className="h-8 ml-[-0.8rem]"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "desc" ? (
        <ArrowDownUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
