import { useState, useId, useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Brush, CheckIcon, MinusIcon } from "lucide-react";
import { useTheme, type Theme } from "../provider/theme-provider";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionStore } from "@/store/use-session-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const items = [
  { value: "light", label: "Light", image: "/images/ui-light.png" },
  { value: "dark", label: "Dark", image: "/images/ui-dark.png" },
  { value: "system", label: "System", image: "/images/ui-system.png" },
];

export default function AppearanceSettings() {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState("inter");
  const initialFont = "inter";
  const isMobile = useIsMobile();
  const { session } = useSessionStore();
  const isAdmin = session?.role === "admin";

  const hasChanges = useMemo(() => {
    return font !== initialFont;
  }, [font]);

  const handleSave = () => {
    console.log("Saved appearance settings:", { theme, font });
  };

  if (isMobile && !isAdmin) {
    return (
      <Sheet>
        <SheetTrigger>
          <div className="flex flex-row items-center gap-4 px-4">
            <Brush size={20} />
            Appearance
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
            <SheetTitle>Appearance</SheetTitle>
          </SheetHeader>
          <div className="px-4 -mt-4 flex flex-col gap-4">
            <div>
              <p className="font-medium">Theme Mode</p>
              <p className="text-muted-foreground text-sm">
                Choose between, light, dark or system default theme.
              </p>
              <fieldset className="space-y-4">
                <RadioGroup
                  className="flex mt-4 gap-3"
                  defaultValue="dark"
                  value={theme}
                  onValueChange={(value) => setTheme(value as Theme)}
                >
                  {items.map((item) => (
                    <label key={`${id}-${item.value}`}>
                      <RadioGroupItem
                        id={`${id}-${item.value}`}
                        value={item.value}
                        className="peer sr-only after:absolute after:inset-0"
                      />
                      <img
                        src={item.image}
                        alt={item.label}
                        width={88}
                        height={70}
                        className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50 h-[4rem] w-[4rem]"
                      />
                      <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
                        <CheckIcon
                          size={16}
                          className="group-peer-data-[state=unchecked]:hidden"
                          aria-hidden="true"
                        />
                        <MinusIcon
                          size={16}
                          className="group-peer-data-[state=checked]:hidden"
                          aria-hidden="true"
                        />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>
            <div>
              <p className="font-medium">Font</p>
              <p className="text-muted-foreground text-sm">
                Select the font used throughout the user interface.
              </p>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="w-48 mt-2">
                  <SelectValue placeholder="Choose font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={handleSave} className="text-base shadow-lg">
            Save Changes
          </Button>
        </div>
      )}

      <h1 className="text-4xl font-medium mb-6">Appearance Settings</h1>
      <div
        className="flex flex-col gap-8 max-w-xl text-lg overflow-y-auto pr-2"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="flex flex-col gap-2 border border-input p-4 rounded-md">
          <p className="font-medium">Theme Mode</p>
          <p className="text-muted-foreground  text-sm">
            Choose between light, dark, or system default theme.
          </p>
          <fieldset className="space-y-4">
            <RadioGroup
              className="flex gap-3"
              defaultValue="dark"
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              {items.map((item) => (
                <label key={`${id}-${item.value}`}>
                  <RadioGroupItem
                    id={`${id}-${item.value}`}
                    value={item.value}
                    className="peer sr-only after:absolute after:inset-0"
                  />
                  <img
                    src={item.image}
                    alt={item.label}
                    width={88}
                    height={70}
                    className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50 h-[10rem] w-[10rem]"
                  />
                  <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
                    <CheckIcon
                      size={16}
                      className="group-peer-data-[state=unchecked]:hidden"
                      aria-hidden="true"
                    />
                    <MinusIcon
                      size={16}
                      className="group-peer-data-[state=checked]:hidden"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <div className="flex flex-col gap-2 border border-input p-4 rounded-md">
          <p className="font-medium">Font Style</p>
          <p className="text-muted-foreground text-sm">
            Select the font used throughout the user interface.
          </p>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-48 mt-2">
              <SelectValue placeholder="Choose font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
