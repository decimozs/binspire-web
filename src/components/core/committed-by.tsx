import useUser from "@/queries/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFallback } from "@/lib/utils";

interface CommittedByProps {
  userId: string;
  enableRole?: boolean;
}

export default function CommittedBy({
  userId,
  enableRole = false,
}: CommittedByProps) {
  const { getUserById: user } = useUser();
  const { data } = user(userId);

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt={data?.name} />
          <AvatarFallback>{avatarFallback(data?.name)}</AvatarFallback>
        </Avatar>
        <span
          className={`border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 ${
            data?.isOnline ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          <span className="sr-only">
            {data?.isOnline ? "Online" : "Offline"}
          </span>
        </span>
      </div>
      <div className="capitalize">
        <p>{data?.name}</p>
        {enableRole && data?.role && (
          <p className="-mt-1 text-sm text-muted-foreground">{data?.role}</p>
        )}
      </div>
    </div>
  );
}
