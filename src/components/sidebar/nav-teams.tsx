import { Shield, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useUser from "@/queries/use-user";

export default function NavTeams() {
  const { isMobile } = useSidebar();
  const { getUsers } = useUser();
  const { data } = getUsers;

  const activeAdmins = data?.filter(
    (i) => i.role === "admin" && i.isOnline && !i.isArchive,
  ).length;
  const activeCollectors = data?.filter(
    (i) => i.role === "collector" && i.isOnline && !i.isArchive,
  ).length;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-9 mt-[1.1px] shrink-0 items-center justify-center rounded-md border">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right stroke-zinc-800 dark:stroke-zinc-100"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Arcovia City</span>
                <span className="truncate text-xs">Binspire</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Active Teams
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Shield className="size-3.5 shrink-0" />
              </div>
              Admin
              <DropdownMenuShortcut>{activeAdmins}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Truck className="size-3.5 shrink-0" />
              </div>
              Collector
              <DropdownMenuShortcut>{activeCollectors}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
