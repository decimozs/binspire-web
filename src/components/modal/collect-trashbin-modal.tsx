import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useId, useRef, useMemo } from "react";
import { LoaderCircleIcon, Trash, TriangleAlert } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import type { Trashbin } from "@/schemas/trashbin-schema";
import useTrashbin from "@/queries/use-trashbin";
import { generateIdNumber } from "@/lib/utils";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useDirectionStore } from "@/store/use-direction-store";

interface CollectTrashbinModalProps {
  data?: Trashbin;
  trashbinId?: string;
}

const confirmationFormSchema = z
  .object({
    identifier: z.string(),
    confirmIdentifier: z.string().min(1, "You must confirm before proceeding"),
  })
  .refine((data) => data.identifier === data.confirmIdentifier, {
    path: ["confirmIdentifier"],
    message: "Input does not match the required identifier.",
  });

export default function CollectTrashbinModal({
  data,
  trashbinId,
}: CollectTrashbinModalProps) {
  const { current: map } = useMap();
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { getTrashbinById, updateTrashbin } = useTrashbin();
  const { isPending } = updateTrashbin;
  const [, setViewDirections] = useQueryState(
    "view_directions",
    parseAsBoolean,
  );
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const clearDirectionsData = useDirectionStore(
    (state) => state.clearDirectionData,
  );

  // Only call the hook conditionally, but outside of effects
  const query = trashbinId && !data ? getTrashbinById(trashbinId) : null;

  // Fallback logic to use data or fetched query result
  const trashbinData: Trashbin | undefined = useMemo(() => {
    if (data) return data;
    if (query?.data) return query.data;
    return undefined;
  }, [data, query?.data]);

  const handleCollect = async () => {
    if (!trashbinData) return;
    await updateTrashbin.mutateAsync(
      {
        id: trashbinData.id,
        data: { isCollected: true },
      },
      {
        onSuccess: () => {
          setViewDirections(null);
          setTrashbinId(null);
          clearDirectionsData();
          setTimeout(() => {
            map?.flyTo({
              center: [
                INITIAL_VIEW_STATE.longitude,
                INITIAL_VIEW_STATE.latitude,
              ],
              zoom: INITIAL_VIEW_STATE.zoom,
              bearing: INITIAL_VIEW_STATE.bearing,
              pitch: INITIAL_VIEW_STATE.pitch,
              essential: true,
            });
          }, 300);
        },
      },
    );
  };

  const form = useForm({
    defaultValues: {
      identifier: `TRASHBIN-${generateIdNumber(trashbinData?.id ?? "")}`,
      confirmIdentifier: "",
    },
    validators: {
      onSubmit: confirmationFormSchema,
    },
    onSubmit: async ({ formApi }) => {
      await handleCollect();
      formApi.reset();
      closeRef.current?.click();
    },
  });

  if (!trashbinData) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          variant={trashbinData.isCollected ? "secondary" : "default"}
          disabled={trashbinData.isCollected}
        >
          {trashbinData.isCollected ? "Collected" : "Collect"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xs">
        <DialogHeader className="flex flex-row gap-4 items-start">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Trash className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <DialogTitle>Collect this trashbin</DialogTitle>
            <DialogDescription>
              Please confirm that you want to mark this trashbin as collected.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="text-sm border-1 border-yellow-600 p-4 rounded-md bg-yellow-600/10 grid grid-cols-[20px_1fr] gap-4">
          <TriangleAlert className="text-yellow-500 mt-1" size={20} />
          <p>
            You're about to mark this trashbin as <strong>collected</strong>.
            Make sure you have physically collected it, as this will update the
            system records and notify the admin.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>
              {`To confirm, type "TRASHBIN-${generateIdNumber(trashbinData.id)}" in the box below`}
            </Label>
            <form.Field
              name="confirmIdentifier"
              children={(f) => (
                <>
                  <Input
                    id={id}
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    aria-invalid={f.state.meta.errors.length > 0}
                  />
                  <FormFieldError field={f} />
                </>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
