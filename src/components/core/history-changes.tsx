import { entityIconMap } from "@/lib/constants";
import type { EntityType } from "@/lib/types";
import { formatLabel, getChangedFields } from "@/lib/utils";
import { ArrowRight, Minus, Plus } from "lucide-react";

interface HistoryEntityChangesProps {
  entity?: EntityType;
  changes: {
    before: Record<string, string>;
    after: Record<string, string>;
  };
}

export function UpdatedChanges({ changes }: HistoryEntityChangesProps) {
  const updateChanges = getChangedFields(changes.before, changes.after);

  return (
    <div className="grid grid-cols-1 gap-2 w-full">
      {Object.entries(updateChanges).map(([key, { before, after }]) => (
        <div key={key} className="flex items-center gap-6">
          <div>
            <Minus size={15} className="text-red-500" />
          </div>
          <div className="border border-dashed rounded-md p-2 w-full flex items-center flex-col bg-red-400/20 ">
            <div className="flex flex-row items-center gap-2">
              <p className="text-[12px] text-muted-foreground capitalize">
                {key}
              </p>
              <p>{formatLabel(String(before))}</p>
            </div>
          </div>

          <div>
            <ArrowRight size={15} />
          </div>

          <div className=" border border-dashed rounded-md p-2 w-full flex items-center flex-col bg-green-400/20">
            <div className="flex flex-row items-center gap-2">
              <p className="text-[12px] text-muted-foreground capitalize">
                {key}
              </p>
              <p>{formatLabel(String(after))}</p>
            </div>
          </div>

          <div>
            <Plus size={15} className="text-green-500" />
          </div>
        </div>
      ))}
    </div>
  );
}
export function DeletedChanges({ entity, changes }: HistoryEntityChangesProps) {
  const Icon = entityIconMap[entity as EntityType];

  return (
    <>
      <p className="text-muted-foreground">Recent</p>
      <div className="border border-dashed rounded-md p-4 w-fit flex items-center flex-col min-w-[100px]">
        <Icon />
        <p className="capitalize">{formatLabel(changes.before.status)}</p>
        <p className="-mt-1 text-[12px] text-muted-foreground">Status</p>
      </div>
      <ArrowRight />
      <div className="border border-dashed rounded-md p-4 w-fit flex items-center flex-col min-w-[100px]">
        <Icon />
        <p className="capitalize">{formatLabel(changes.after.status)}</p>
        <p className="-mt-1 text-[12px] text-muted-foreground">Status</p>
      </div>
      <p className="text-muted-foreground">Latest</p>
    </>
  );
}
