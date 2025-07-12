import React from "react";
import { Box, Brush, Database, Info, Settings2 } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { CommandDialog } from "@/components/ui/command";
import { useIsMobile } from "@/hooks/use-mobile";

const tabs = [
  { name: "General", icon: Box },
  { name: "Appearance", icon: Brush },
  { name: "Backup", icon: Database },
  { name: "About", icon: Info },
];

export default function SettingsModal() {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("General");
  const isMobile = useIsMobile();

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
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(true)}>
          <Settings2 size={16} />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {!isMobile ? (
        <CommandDialog open={open} onOpenChange={setOpen} className="min-w-3xl">
          <div className="p-4 flex flex-col gap-4">
            <h1 className="text-lg font-medium">Settings</h1>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="flex flex-col space-y-4">
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

              <div className="min-h-[300px]">
                {activeTab === "General" && (
                  <p>This is general settings content.</p>
                )}
                {activeTab === "Appearance" && (
                  <p>This is appearance settings content.</p>
                )}
                {activeTab === "Backup" && (
                  <p>This is backup settings content.</p>
                )}
                {activeTab === "About" && (
                  <p>This is about info and version details.</p>
                )}
              </div>
            </div>
          </div>
        </CommandDialog>
      ) : (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="p-4 flex flex-col gap-4">
            <h1 className="text-lg font-medium">Settings</h1>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="flex flex-col space-y-4">
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

              <div className="min-h-[300px]">
                {activeTab === "General" && (
                  <p>This is general settings content.</p>
                )}
                {activeTab === "Appearance" && (
                  <p>This is appearance settings content.</p>
                )}
                {activeTab === "Backup" && (
                  <p>This is backup settings content.</p>
                )}
                {activeTab === "About" && (
                  <p>This is about info and version details.</p>
                )}
              </div>
            </div>
          </div>
        </CommandDialog>
      )}
    </>
  );
}
