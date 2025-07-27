import { useSessionStore } from "@/store/use-session-store";
import type { Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { avatarFallback } from "@/lib/utils";

interface NameTableProps<TData> {
  row: Row<TData>;
}

export default function NameTable<
  TData extends { id: string; isOnline: boolean },
>({ row }: NameTableProps<TData>) {
  const { session } = useSessionStore();
  const name = row.getValue("name") as string;
  const isOnline = row.original.isOnline;

  return (
    <span className="flex items-center gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt={name} />
          <AvatarFallback>{avatarFallback(name)}</AvatarFallback>
        </Avatar>
        <span
          className={`border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 ${
            isOnline ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
        </span>
      </div>
      {session?.userId === row.original.id ? (
        <span className="flex flex-row items-center gap-2">
          {name}
          <p className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">
            You
          </p>
        </span>
      ) : (
        <span>{name}</span>
      )}
    </span>
  );
}
