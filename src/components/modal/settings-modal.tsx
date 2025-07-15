import React from "react";
import { Box, Brush, Database, Info, Settings2 } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { CommandDialog } from "@/components/ui/command";
import { useIsMobile } from "@/hooks/use-mobile";
import BackupSettings from "../settings/backup-settings";
import AppearanceSettings from "../settings/appearance-settings";
import GeneralSettings from "../settings/general-settings";
import AboutSettings from "../settings/about-settings";
import { useSessionStore } from "@/store/use-session-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SettingsModal() {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("General");
  const isMobile = useIsMobile();
  const { session } = useSessionStore();

  const tabs = [
    { name: "General", icon: Box },
    { name: "Appearance", icon: Brush },
    ...(session?.role !== "collector"
      ? [{ name: "Backup", icon: Database }]
      : []),
    { name: "About", icon: Info },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "s" &&
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {!isMobile && (
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setOpen(true)}>
            <Settings2 size={16} />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      {!isMobile ? (
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="min-w-7xl h-[800px]"
        >
          <div className="p-8 flex flex-col gap-4">
            <h1 className="text-lg font-medium">Settings</h1>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="flex flex-col space-y-4 mt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-3 text-left cursor-pointer ${
                      activeTab === tab.name ? " font-semibold" : ""
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
              <div className="min-h-[300px] mt-4 ml-8">
                {activeTab === "General" && <GeneralSettings />}
                {activeTab === "Appearance" && <AppearanceSettings />}
                {activeTab === "Backup" && session?.role !== "collector" && (
                  <BackupSettings />
                )}
                {activeTab === "About" && <AboutSettings />}
              </div>
            </div>
          </div>
        </CommandDialog>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <SidebarMenuButton onClick={() => setOpen(true)}>
              <Settings2 size={16} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
            <GeneralSettings />
            <AppearanceSettings />
            <AboutSettings />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
