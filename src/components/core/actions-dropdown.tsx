import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import type { ReactNode } from "@tanstack/react-router";

export function ActionsDropdown({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 -mr-2">
          <Ellipsis size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-[4rem] mt-[-2rem]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
