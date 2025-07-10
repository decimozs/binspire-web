import { useId } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";

type PaginationProps<T> = {
  table: Table<T>;
};

export default function PaginationTable<T>({ table }: PaginationProps<T>) {
  const id = useId();
  const pageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col space-x-2 pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-muted-foreground flex grow justify-start text-sm whitespace-nowrap">
            <p aria-live="polite">
              <span className="text-foreground">
                {pageIndex * table.getState().pagination.pageSize + 1}-
                {Math.min(
                  (pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}
              </span>{" "}
              of{" "}
              <span className="text-foreground">
                {table.getFilteredRowModel().rows.length}
              </span>
            </p>
          </div>
          <div className="text-muted-foreground text-sm text-right">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="w-[100px]">
              Rows per page
            </Label>
            <Select
              defaultValue={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <PaginationLink
                        onClick={() => table.setPageIndex(0)}
                        aria-disabled={!table.getCanPreviousPage()}
                        className={
                          !table.getCanPreviousPage()
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        items-center
                        justify-between
                        gap-8
                      >
                        <ChevronFirstIcon size={16} />
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>Go to first page</TooltipContent>
                  </Tooltip>
                </PaginationItem>
                <PaginationItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <PaginationLink
                        onClick={() => table.previousPage()}
                        aria-disabled={!table.getCanPreviousPage()}
                        className={
                          !table.getCanPreviousPage()
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        <ChevronLeftIcon size={16} />
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>Go to previous page</TooltipContent>
                  </Tooltip>
                </PaginationItem>
                <PaginationItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <PaginationLink
                        onClick={() => table.nextPage()}
                        aria-disabled={!table.getCanNextPage()}
                        className={
                          !table.getCanNextPage()
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        <ChevronRightIcon size={16} />
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>Go to next page</TooltipContent>
                  </Tooltip>
                </PaginationItem>
                <PaginationItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <PaginationLink
                        onClick={() => table.setPageIndex(totalPages - 1)}
                        aria-disabled={!table.getCanNextPage()}
                        className={
                          !table.getCanNextPage()
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        <ChevronLastIcon size={16} />
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to last page</p>
                    </TooltipContent>
                  </Tooltip>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="w-[100px]">
            Rows per page
          </Label>
          <Select
            defaultValue={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p aria-live="polite">
            <span className="text-foreground">
              {pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                (pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger>
                  <PaginationLink
                    onClick={() => table.setPageIndex(0)}
                    aria-disabled={!table.getCanPreviousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <ChevronFirstIcon size={16} />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>Go to first page</TooltipContent>
              </Tooltip>
            </PaginationItem>
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger>
                  <PaginationLink
                    onClick={() => table.previousPage()}
                    aria-disabled={!table.getCanPreviousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <ChevronLeftIcon size={16} />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>Go to previous page</TooltipContent>
              </Tooltip>
            </PaginationItem>
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger>
                  <PaginationLink
                    onClick={() => table.nextPage()}
                    aria-disabled={!table.getCanNextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <ChevronRightIcon size={16} />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>Go to next page</TooltipContent>
              </Tooltip>
            </PaginationItem>
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger>
                  <PaginationLink
                    onClick={() => table.setPageIndex(totalPages - 1)}
                    aria-disabled={!table.getCanNextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <ChevronLastIcon size={16} />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to last page</p>
                </TooltipContent>
              </Tooltip>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
