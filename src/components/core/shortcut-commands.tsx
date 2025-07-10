import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useUser from "@/queries/use-user";
import { Trash, UserRound } from "lucide-react";
import useTrashbin from "@/queries/use-trashbin";
import useRequestAccess from "@/queries/use-request-access";
import { parseAsBoolean, useQueryState } from "nuqs";
import { generateIdNumber } from "@/lib/utils";

export function FindUserShortcut() {
  const [open, setOpen] = React.useState(false);
  const { getUsers } = useUser();
  const { data, isLoading } = getUsers;
  const [, setUserId] = useQueryState("user_id");
  const [, setViewUser] = useQueryState("view_user", parseAsBoolean);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "u" &&
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
    <CommandDialog open={open} onOpenChange={setOpen} className="min-w-2xl">
      <CommandInput placeholder="Find by user id" />
      <CommandList className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <CommandGroup heading="Loading users...">
            <CommandItem>
              <div className="text-muted-foreground text-sm">Loading...</div>
            </CommandItem>
          </CommandGroup>
        ) : (
          <>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup
              heading={
                <div className="flex flex-row items-center justify-between">
                  <p>List of users</p>
                  <p>{data?.length} users</p>
                </div>
              }
            >
              {data?.map((i) => (
                <CommandItem
                  key={i.id}
                  value={`USER-${generateIdNumber(i.id)}`}
                  onSelect={(e) => {
                    setViewUser(true);
                    setUserId(i.id);
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <UserRound className="mt-1" />
                    <div>
                      <p>{i.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.email}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function FindTrashbinShortcut() {
  const [open, setOpen] = React.useState(false);
  const { getTrashbins } = useTrashbin();
  const { data, isLoading } = getTrashbins;
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "t" &&
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
    <CommandDialog open={open} onOpenChange={setOpen} className="min-w-2xl">
      <CommandInput placeholder="Find by trashbin id" />
      <CommandList className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <CommandGroup heading="Loading trashbins...">
            <CommandItem>
              <div className="text-muted-foreground text-sm">Loading...</div>
            </CommandItem>
          </CommandGroup>
        ) : (
          <>
            <CommandEmpty>No trashbins found.</CommandEmpty>
            <CommandGroup
              heading={
                <div className="flex flex-row items-center justify-between">
                  <p>List of trashbins</p>
                  <p>{data?.length} trashbins</p>
                </div>
              }
            >
              {data?.map((i) => (
                <CommandItem
                  key={i.id}
                  value={`TRASHBIN-${generateIdNumber(i.id)}`}
                  onSelect={(e) => {
                    setViewTrashbin(true);
                    setTrashbinId(i.id);
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <Trash className="mt-1" />
                    <div>
                      <p>{i.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.location}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function FindRequestShortcut() {
  const [open, setOpen] = React.useState(false);
  const { getRequestAccess } = useRequestAccess();
  const { data, isLoading } = getRequestAccess;
  const [, setRequestAccessId] = useQueryState("request_access_id");
  const [, setViewRequestAccess] = useQueryState(
    "view_request_access",
    parseAsBoolean,
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "r" &&
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
    <CommandDialog open={open} onOpenChange={setOpen} className="min-w-2xl">
      <CommandInput placeholder="Find by request id" />
      <CommandList className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <CommandGroup heading="Loading requests...">
            <CommandItem>
              <div className="text-muted-foreground text-sm">Loading...</div>
            </CommandItem>
          </CommandGroup>
        ) : (
          <>
            <CommandEmpty>No requests found.</CommandEmpty>
            <CommandGroup
              heading={
                <div className="flex flex-row items-center justify-between">
                  <p>List of requests</p>
                  <p>{data?.length} requests</p>
                </div>
              }
            >
              {data?.map((i) => (
                <CommandItem
                  key={i.id}
                  value={`REQUEST-${generateIdNumber(i.id)}`}
                  onSelect={(e) => {
                    setViewRequestAccess(true);
                    setRequestAccessId(i.id);
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <UserRound className="mt-1" />
                    <div>
                      <p>{i.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.email}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export default function ShortcutCommands() {
  return (
    <>
      <FindUserShortcut />
      <FindTrashbinShortcut />
      <FindRequestShortcut />
    </>
  );
}
