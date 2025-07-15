import { useId, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function BackupSettings() {
  const autoBackupId = useId();

  const initialAutoBackup = true;
  const initialBackupFrequency = "weekly";

  const [autoBackup, setAutoBackup] = useState<boolean>(initialAutoBackup);
  const [backupFrequency, setBackupFrequency] = useState(
    initialBackupFrequency,
  );

  const hasChanges = useMemo(() => {
    return (
      autoBackup !== initialAutoBackup ||
      backupFrequency !== initialBackupFrequency
    );
  }, [autoBackup, backupFrequency]);

  const handleSave = () => {
    console.log("Saved settings:", { autoBackup, backupFrequency });
  };

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

      <h1 className="text-4xl font-medium">Backup & Restore</h1>
      <div className="flex flex-col gap-4 max-w-3xl text-lg">
        {/* Automatic Backup */}
        <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Automatic Backup</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Enable or disable scheduled backups of your system data.
            </p>
          </div>
          <div className="mt-1 inline-flex items-center gap-2">
            <Switch
              id={autoBackupId}
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
              aria-label="Toggle automatic backup"
            />
            <Label htmlFor={autoBackupId} className="text-sm font-medium">
              {autoBackup ? "On" : "Off"}
            </Label>
          </div>
        </div>

        {/* Backup Frequency */}
        <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Backup Frequency</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Choose how often automatic backups should occur.
            </p>
          </div>
          <Select value={backupFrequency} onValueChange={setBackupFrequency}>
            <SelectTrigger className="w-40 mt-1">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Manual Backup */}
        <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Manual Backup</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Instantly create a backup of current system data.
            </p>
          </div>
          <Button className="mt-1">Create Backup</Button>
        </div>

        {/* Restore Data */}
        <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Restore Data</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Upload a previously downloaded backup file to restore your system.
            </p>
          </div>
          <Input type="file" accept=".zip,.json" className="w-48 mt-1" />
        </div>

        {/* Cloud Integration */}
        <div className="flex flex-row justify-between items-start border border-input p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Cloud Integration</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Connect your system to cloud storage services like Google Drive or
              Dropbox for automatic backup syncing.
            </p>
          </div>
          <Button variant="outline" className="mt-1">
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}
