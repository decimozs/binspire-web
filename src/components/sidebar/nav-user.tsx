import {
  ChevronsUpDown,
  CircleUserRoundIcon,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSessionStore } from "@/store/use-session-store";
import { avatarFallback, capitalize } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useAuth } from "@/queries/use-auth";
import useUser from "@/queries/use-user";
import UserHistoryModal from "../modal/user-history-modal";
import NotificationSheet from "../sheet/notification-sheet";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function NavUser() {
  const { session } = useSessionStore();
  const { getUserById } = useUser();
  const { data: user, isPending } = getUserById(session?.userId || "");
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const [, setUserId] = useQueryState("user_id");
  const [, setViewUser] = useQueryState("view_user", parseAsBoolean);

  if (isPending || !user) return null;

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const handleSetParams = () => {
    setViewUser(true);
    setUserId(session?.userId || "");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={user.name} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {avatarFallback(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.name} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {avatarFallback(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-row items-center gap-2">
                    <CircleUserRoundIcon />
                    {capitalize(user.role)}
                  </div>
                  <Badge variant="outline">{capitalize(user.permission)}</Badge>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={handleSetParams}
              >
                <User />
                Account
              </DropdownMenuItem>
              <UserHistoryModal />
              <NotificationSheet />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
