import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useSessionStore } from "@/store/use-session-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Box } from "lucide-react";

export default function GeneralSettings() {
  const isMobile = useIsMobile();
  const initialValues = {
    systemName: "Arcovia City",
    timezone: "Asia/Manila",
    language: "english",
    notificationEmail: "binspire.contact@gmail.com",
    refreshInterval: "5",
    threshold: "80",
  };
  const { session } = useSessionStore();
  const isAdmin = session?.role === "admin";
  const [systemName, setSystemName] = useState(initialValues.systemName);
  const [timezone, setTimezone] = useState(initialValues.timezone);
  const [language, setLanguage] = useState(initialValues.language);
  const [notificationEmail, setNotificationEmail] = useState(
    initialValues.notificationEmail,
  );
  const [refreshInterval, setRefreshInterval] = useState(
    initialValues.refreshInterval,
  );
  const [threshold, setThreshold] = useState(initialValues.threshold);
  const hasChanges = useMemo(() => {
    return (
      systemName !== initialValues.systemName ||
      timezone !== initialValues.timezone ||
      language !== initialValues.language ||
      notificationEmail !== initialValues.notificationEmail ||
      refreshInterval !== initialValues.refreshInterval ||
      threshold !== initialValues.threshold
    );
  }, [
    systemName,
    timezone,
    language,
    notificationEmail,
    refreshInterval,
    threshold,
  ]);

  const handleSave = () => {
    console.log("Saved:", {
      systemName,
      timezone,
      language,
      notificationEmail,
      refreshInterval,
      threshold,
    });
  };

  if (isMobile && !isAdmin) {
    return (
      <Sheet>
        <SheetTrigger>
          <div className="flex flex-row items-center gap-4 px-4">
            <Box size={20} />
            General
          </div>
        </SheetTrigger>
        <SheetContent>
          {hasChanges && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button onClick={handleSave} className="text-base shadow-lg">
                Save Changes
              </Button>
            </div>
          )}
          <SheetHeader>
            <SheetTitle>General</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="px-4">
              <p className="font-medium">Timezone</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Enable or disable scheduled backups of your system data.
              </p>
              <div className="max-w-[360px]">
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-3">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Manila">
                      Asia/Manila (GMT+8)
                    </SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Asia/Tokyo">
                      Asia/Tokyo (GMT+9)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      America/New York (GMT-4)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="px-4">
              <p className="font-medium">Default Language</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Enable or disable scheduled backups of your system data.
              </p>
              <div className="max-w-[360px]">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-3">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="filipino">Filipino</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex flex-col gap-8 -mt-2">
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSave}
            className="px-6 py-2 text-base shadow-lg"
          >
            Save Changes
          </Button>
        </div>
      )}

      <h1 className="text-4xl font-medium">General</h1>
      <div className="flex flex-col gap-4 max-w-3xl text-lg max-h-[600px] overflow-y-auto">
        {isAdmin && (
          <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Organization Name</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Enable or disable scheduled backups of your system data.
              </p>
              <Input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="mt-3"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 border border-input p-4 rounded-md">
          <p className="font-medium">Timezone</p>
          <p className="text-muted-foreground text-sm max-w-md">
            Enable or disable scheduled backups of your system data.
          </p>
          <div className="max-w-[360px]">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Manila">Asia/Manila (GMT+8)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                <SelectItem value="America/New_York">
                  America/New York (GMT-4)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1 border border-input p-4 rounded-md">
          <p className="font-medium">Default Language</p>
          <p className="text-muted-foreground text-sm max-w-md">
            Enable or disable scheduled backups of your system data.
          </p>
          <div className="max-w-[360px]">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="filipino">Filipino</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isAdmin && (
          <>
            <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Notification Email</p>
                <p className="text-muted-foreground text-sm max-w-md">
                  Enable or disable scheduled backups of your system data.
                </p>
                <Input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="mt-3"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 border border-input p-4 rounded-md">
              <p className="font-medium">Data Refresh Interval</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Enable or disable scheduled backups of your system data.
              </p>
              <div className="max-w-[360px] mt-3">
                <Select
                  value={refreshInterval}
                  onValueChange={setRefreshInterval}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every 1 min</SelectItem>
                    <SelectItem value="5">Every 5 mins</SelectItem>
                    <SelectItem value="10">Every 10 mins</SelectItem>
                    <SelectItem value="30">Every 30 mins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Waste Level Threshold</p>
                <p className="text-muted-foreground text-sm max-w-md">
                  Enable or disable scheduled backups of your system data.
                </p>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={threshold}
                  className="mt-3"
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
