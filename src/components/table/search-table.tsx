import { useId, useRef } from "react";
import { CircleXIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";

type SearchTableProps<T> = {
  pattern: string;
  table: Table<T>;
};

export default function SearchTable<T>({
  pattern,
  table,
}: SearchTableProps<T>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const column = table.getColumn(pattern);
  const value = (column?.getFilterValue() as string) ?? "";

  const handleClearInput = () => {
    column?.setFilterValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          id={id}
          ref={inputRef}
          className="peer ps-9 w-full h-9"
          type="text"
          placeholder={`Search by ${pattern}`}
          value={value}
          onChange={(event) => column?.setFilterValue(event.target.value)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <Search size={16} aria-hidden="true" />
        </div>
        {value && (
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 mr-1"
            aria-label="Clear input"
            onClick={handleClearInput}
          >
            <CircleXIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
