import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Column, Table } from "@tanstack/react-table";
import { filteringSonner } from "../ui/sonner";
import { toast } from "sonner";

interface DateRangeFilterProps<T> {
  column?: Column<T, unknown>;
  table: Table<T>;
}

export function DateRangeFilterButton<T>({
  column,
  table,
}: DateRangeFilterProps<T>) {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const filterValue = column?.getFilterValue() as DateRange | undefined;
    return filterValue;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const filterValue = column?.getFilterValue() as DateRange | undefined;
    if (filterValue?.from !== date?.from || filterValue?.to !== date?.to) {
      setDate(filterValue);
    }
  }, [column?.getFilterValue()]);

  const presets = [
    { label: "Today", range: { from: today, to: today } },
    {
      label: "Yesterday",
      range: { from: subDays(today, 1), to: subDays(today, 1) },
    },
    { label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
    { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
    { label: "Month to date", range: { from: startOfMonth(today), to: today } },
    {
      label: "Last month",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
    { label: "Year to date", range: { from: startOfYear(today), to: today } },
    {
      label: "Last year",
      range: {
        from: startOfYear(subYears(today, 1)),
        to: endOfYear(subYears(today, 1)),
      },
    },
  ];

  const applyFilter = (range: DateRange | undefined) => {
    setDate(range);
    column?.setFilterValue(range);
    filteringSonner({ table });
  };

  const clearFilter = () => {
    setDate(undefined);
    column?.setFilterValue(undefined);
    toast.dismiss("filtering-sonner");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 font-medium border-muted border-dashed border-[1px] justify-start text-left"
        >
          <CalendarIcon className="" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM d, yyyy")} -{" "}
                {format(date.to, "MMM d, yyyy")}
              </>
            ) : (
              format(date.from, "MMM d, yyyy")
            )
          ) : (
            <span>Created At</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-input w-auto p-0" align="start">
        <div className="rounded-md">
          <div className="flex max-sm:flex-col">
            <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
              <div className="h-full sm:border-e">
                <div className="flex flex-col px-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => applyFilter(preset.range)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                  {date && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive"
                      onClick={clearFilter}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={applyFilter}
              className="p-2"
              disabled={{ after: today }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
