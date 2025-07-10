import {
  ChevronsUpDown,
  CirclePlus,
  EyeOff,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { filteringSonner } from "../ui/sonner";
import { Button } from "../ui/button";
import type { Column, Table } from "@tanstack/react-table";
import { useId, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { formatLabel } from "@/lib/utils";

interface FilterTableButtonProps<T> {
  table: Table<T>;
  label: string;
  columns: Column<T, unknown>;
  filterOptions: FilterOptions[];
}

export interface FilterOptions {
  label: string;
  filterValue: string;
  icon: LucideIcon;
}

export function FilterTableButton<T>({
  table,
  label,
  columns,
  filterOptions,
}: FilterTableButtonProps<T>) {
  const handleResetFilter = () => {
    columns.setFilterValue(undefined);
    toast.dismiss("filtering-sonner");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 ml-[-0.8rem]">
          {label}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filterOptions.map((item) => (
          <DropdownMenuItem
            key={item.filterValue}
            onClick={() => {
              console.log("value from filter : ", item.filterValue);
              columns.setFilterValue(item.filterValue);
              filteringSonner({
                table,
              });
            }}
          >
            <item.icon />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <>
          {columns.getFilterValue() && (
            <DropdownMenuItem onClick={handleResetFilter}>
              <X />
              Reset
            </DropdownMenuItem>
          )}
        </>
        <DropdownMenuItem onClick={() => columns.toggleVisibility(false)}>
          <EyeOff />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface NavFilterTableButtonProps<T> {
  table: Table<T>;
  label?: string;
  columns?: Column<T, unknown>;
  navFilterOptions?: NavFilterOptions[];
}

export interface NavFilterOptions {
  label: string;
  navFilterValue: string;
}

export default function NavFilterTableButton<T>({
  label,
  table,
  columns,
  navFilterOptions = [],
}: NavFilterTableButtonProps<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rawValue = columns?.getFilterValue();
  const currentValue: string[] = Array.isArray(rawValue)
    ? rawValue
    : typeof rawValue === "string"
      ? [rawValue]
      : [];

  const toggleValue = (value: string) => {
    console.log("value from nav filter: ", value);
    const newValue = currentValue.includes(value)
      ? currentValue.filter((v) => v !== value)
      : [...currentValue, value];

    columns?.setFilterValue(newValue.length > 0 ? newValue : undefined);
    filteringSonner({ table });
  };

  const clearFilters = () => {
    columns?.setFilterValue(undefined);
    setOpen(false);
    toast.dismiss("filtering-sonner");
  };

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 border-muted border-dashed border-[1px] justify-between w-full px-3"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CirclePlus />
              <span>{label}</span>
              {currentValue.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {currentValue.slice(0, 3).map((value, index) => {
                    const item = navFilterOptions.find(
                      (opt) => opt.navFilterValue === value,
                    );
                    return (
                      <span
                        key={value}
                        className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-medium capitalize"
                      >
                        {item?.label ?? value}
                        {index < Math.min(2, currentValue.length - 1)}
                      </span>
                    );
                  })}
                  {currentValue.length > 3 && (
                    <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                      +{currentValue.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {navFilterOptions.map((item) => (
                  <CommandItem
                    key={item.navFilterValue}
                    onSelect={() => toggleValue(item.navFilterValue)}
                    className="gap-2"
                  >
                    <Checkbox
                      checked={currentValue.includes(item.navFilterValue)}
                      onCheckedChange={() => toggleValue(item.navFilterValue)}
                    />
                    <span className="capitalize">
                      {formatLabel(item.label)}
                    </span>
                  </CommandItem>
                ))}
                {currentValue.length > 0 && (
                  <CommandItem onSelect={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear filters
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
