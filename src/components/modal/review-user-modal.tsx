import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import RoleBadge from "../badge/role-badge";
import { IdToggle } from "../core/id-toggle";
import { useSessionStore } from "@/store/use-session-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import PermissionBadge from "../badge/permission-badge";
import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { FormFieldError } from "../form/form-field-error";
import useUser from "@/queries/use-user";
import { UpdateModal } from "./update-modal";
import { DeleteModal } from "./delete-modal";
import PermissionGuard from "../core/permission-guard";
import { useEffect, useState } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { avatarFallback, generateIdNumber } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const reviewUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.email("Invalid email address").min(1, "Email is required"),
});

export type ReviewUserFormFields = z.infer<typeof reviewUserSchema>;

export default function ReviewUserModal() {
  const { updateUser, deleteUser, getUserById } = useUser();
  const { session } = useSessionStore();
  const isUpdating = updateUser.isPending;
  const isDeleting = deleteUser.isPending;
  const [userId, setUserId] = useQueryState("user_id");
  const [viewUser, setViewUser] = useQueryState("view_user", parseAsBoolean);
  const { data, isLoading } = getUserById(userId || "");
  const isYou = session?.userId === data?.id;
  const [open, setOpen] = useState(!!viewUser);
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpen(!!viewUser);
  }, [viewUser]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setUserId(null);
        setViewUser(null);
      }, 300);
    }
  };

  const form = useForm({
    defaultValues: {
      name: data?.name,
      email: data?.email,
    },
    validators: {
      onSubmit: reviewUserSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await updateUser.mutateAsync({
        id: data?.id || "",
        data: { name: value.name, email: value.email },
      });

      formApi.reset();
    },
  });

  const handleArchive = async (id: string) => {
    if (!data) return;

    await updateUser.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    if (!data) return;

    await deleteUser.mutateAsync(id);

    handleOpenChange(false);
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading User Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="flex flex-row gap-4">
            <Avatar className="size-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-[2rem]">
                {avatarFallback(data.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm font-medium text-left">
                User ID
              </p>
              <div>
                <IdToggle id={`USER-${generateIdNumber(data.id)}`} />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <RoleBadge role={data.role} />
                <PermissionBadge permission={data.permission} />
              </div>
            </div>
          </DialogHeader>
          <Separator />
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid grid-rows-2 gap-4">
              <div className="">
                <p className="text-sm text-muted-foreground">Name</p>
                {isYou ? (
                  <form.Field name="name">
                    {(f) => (
                      <>
                        <Input
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                          aria-invalid={f.state.meta.errors.length > 0}
                          className="mt-1"
                        />
                        <FormFieldError field={f} />
                      </>
                    )}
                  </form.Field>
                ) : (
                  <p>{data.name}</p>
                )}
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground">Email</p>
                {isYou ? (
                  <form.Field name="email">
                    {(f) => (
                      <>
                        <Input
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                          className="mt-1"
                          aria-invalid={f.state.meta.errors.length > 0}
                        />
                        <FormFieldError field={f} />
                      </>
                    )}
                  </form.Field>
                ) : (
                  <p>{data.email}</p>
                )}{" "}
              </div>
            </div>
            {isYou && (
              <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                  const isUnchanged =
                    values.name === data.name && values.email === data.email;

                  return (
                    <DialogFooter>
                      <div className="flex flex-row gap-2 items-center w-full">
                        <div className="flex flex-row gap-2 items-center">
                          <UpdateModal
                            data={data}
                            buttonType="icon"
                            action={data.isArchive ? "restore" : "archive"}
                            onUpdate={() => handleArchive(data.id)}
                            isPending={isUpdating}
                            resourceType="user-management"
                          />
                          <DeleteModal
                            data={data}
                            buttonType="icon"
                            onDelete={handleDelete}
                            isPending={isDeleting}
                            resourceType="user-management"
                          />
                        </div>
                        <Separator
                          orientation="vertical"
                          className="data-[orientation=vertical]:h-6"
                        />
                        <UpdateModal
                          data={data}
                          buttonType="modal"
                          action="update"
                          label="Save Changes"
                          onUpdate={() => form.handleSubmit()}
                          isPending={isUpdating}
                          resourceType="user-management"
                          disabled={isUnchanged}
                        />
                      </div>
                    </DialogFooter>
                  );
                }}
              </form.Subscribe>
            )}
          </form>
          <PermissionGuard excludeIf={isYou}>
            <div className="flex flex-row gap-2 items-center w-full">
              <DeleteModal
                data={data}
                buttonType="icon"
                onDelete={handleDelete}
                isPending={isDeleting}
                resourceType="user-management"
              />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-6"
              />
              <UpdateModal
                data={data}
                buttonType="modal"
                action={data.isArchive ? "restore" : "archive"}
                onUpdate={() => handleArchive(data.id)}
                isPending={isUpdating}
                resourceType="user-management"
              />
            </div>
          </PermissionGuard>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader className="flex items-center justify-center">
          <Avatar className="size-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-[2rem]">
              {avatarFallback(data.name)}
            </AvatarFallback>
          </Avatar>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div className="flex flex-row justify-c items-center">
            <div>
              <p className="text-muted-foreground text-sm font-medium text-center">
                User ID
              </p>
              <div className="ml-11">
                <IdToggle id={`USER-${generateIdNumber(data.id)}`} />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <p className="text-sm text-muted-foreground">Name</p>
              {isYou ? (
                <form.Field name="name">
                  {(f) => (
                    <>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        aria-invalid={f.state.meta.errors.length > 0}
                        className="mt-1"
                      />
                      <FormFieldError field={f} />
                    </>
                  )}
                </form.Field>
              ) : (
                <p>{data.name}</p>
              )}
            </div>
            <div className="">
              <p className="text-sm text-muted-foreground">Email</p>
              {isYou ? (
                <form.Field name="email">
                  {(f) => (
                    <>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className="mt-1"
                        aria-invalid={f.state.meta.errors.length > 0}
                      />
                      <FormFieldError field={f} />
                    </>
                  )}
                </form.Field>
              ) : (
                <p>{data.email}</p>
              )}{" "}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <p className="text-sm text-muted-foreground mb-2">
                Role & Permission
              </p>
              <div className="flex items-center gap-2">
                <RoleBadge role={data.role} />
                <PermissionBadge permission={data.permission} />
              </div>
            </div>
            <div className="">
              <p className="text-sm text-muted-foreground">Joined At</p>
              <div className="capitalize">
                {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
              </div>
            </div>
          </div>
          {isYou && (
            <form.Subscribe selector={(state) => state.values}>
              {(values) => {
                const isUnchanged =
                  values.name === data.name && values.email === data.email;

                return (
                  <DialogFooter>
                    <div className="flex flex-row gap-2 items-center w-full">
                      <div className="flex flex-row gap-2 items-center">
                        <UpdateModal
                          data={data}
                          buttonType="icon"
                          action={data.isArchive ? "restore" : "archive"}
                          onUpdate={() => handleArchive(data.id)}
                          isPending={isUpdating}
                          resourceType="user-management"
                        />
                        <DeleteModal
                          data={data}
                          buttonType="icon"
                          onDelete={handleDelete}
                          isPending={isDeleting}
                          resourceType="user-management"
                        />
                      </div>
                      <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-6"
                      />
                      <UpdateModal
                        data={data}
                        buttonType="modal"
                        action="update"
                        label="Save Changes"
                        onUpdate={() => form.handleSubmit()}
                        isPending={isUpdating}
                        resourceType="user-management"
                        disabled={isUnchanged}
                      />
                    </div>
                  </DialogFooter>
                );
              }}
            </form.Subscribe>
          )}
        </form>
        <PermissionGuard excludeIf={isYou}>
          <div className="flex flex-row gap-2 items-center w-full">
            <DeleteModal
              data={data}
              buttonType="icon"
              onDelete={handleDelete}
              isPending={isDeleting}
              resourceType="user-management"
            />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-6"
            />
            <UpdateModal
              data={data}
              buttonType="modal"
              action={data.isArchive ? "restore" : "archive"}
              onUpdate={() => handleArchive(data.id)}
              isPending={isUpdating}
              resourceType="user-management"
            />
          </div>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  );
}
