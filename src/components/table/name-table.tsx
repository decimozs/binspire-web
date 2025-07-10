import { useSessionStore } from "@/store/use-session-store";
import type { Row } from "@tanstack/react-table";

interface NameTableProps<TData> {
  row: Row<TData>;
}

export default function NameTable<TData extends { id: string }>({
  row,
}: NameTableProps<TData>) {
  const { session } = useSessionStore();

  return (
    <span className="flex items-center gap-2">
      {session?.userId === row.original.id ? (
        <span className="flex flex-row items-center gap-2">
          {row.getValue("name") as string}
          <p className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">
            You
          </p>
        </span>
      ) : (
        row.getValue("name")
      )}
    </span>
  );
}
