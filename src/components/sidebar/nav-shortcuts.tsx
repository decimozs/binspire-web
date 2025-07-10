import { Layers2, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSessionStore } from "@/store/use-session-store";

interface Shortcut {
  name: string;
  icon: LucideIcon;
}

const shortcutKeys = "utr".split("");

function ShortcutMenu({ item, index }: { item: Shortcut; index: number }) {
  const keyLetter = shortcutKeys[index] ?? "?";
  const { session } = useSessionStore();

  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton className="flex flex-row items-center justify-between">
        <p className="flex items-center gap-2">
          <item.icon size={15} />
          <span>{item.name}</span>
        </p>
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span>CTRL + SHIFT + </span>
          {session?.role === "admin" ? keyLetter : "t"}
        </kbd>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AdminShortcuts({ shortcuts }: { shortcuts: Shortcut[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
      <SidebarMenu>
        {shortcuts.map((item, index) => (
          <ShortcutMenu key={item.name} item={item} index={index} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function CollectorShortcuts({ shortcuts }: { shortcuts: Shortcut[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
      <SidebarMenu>
        {shortcuts.map((item, index) => (
          <ShortcutMenu key={item.name} item={item} index={index} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default function NavShortcuts() {
  const { session } = useSessionStore();
  const role = session?.role || "";

  const adminShortcuts: Shortcut[] = [
    { name: "Find User", icon: Layers2 },
    { name: "Find Trashbin", icon: Layers2 },
    { name: "Find Request", icon: Layers2 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {role === "admin" && <AdminShortcuts shortcuts={adminShortcuts} />}
    </div>
  );
}
