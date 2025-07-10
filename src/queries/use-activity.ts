import activityApi from "@/api/activity-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type { CreateActivity, UpdateActivity } from "@/schemas/activity-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/schemas/activity-schema";

function useGetActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => activityApi.getActivities(),
  });
}

function useGetActivityById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Activity[]>(["activities"])
    ?.find((i) => i.id === id);

  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityApi.getActivityById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useGetActivityByUserId(userId: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Activity[]>(["activities"])
    ?.filter((i) => i.actorId === userId);

  return useQuery({
    queryKey: ["user-activity"],
    queryFn: () => activityApi.getActivityByUserId(userId),
    enabled: !!userId,
    initialData: cachedData,
  });
}

function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateActivity) => {
      return await activityApi.createActivity(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });
}

function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateActivity }) => {
      return await activityApi.updateActivity(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      queryClient.invalidateQueries({ queryKey: ["activity", variables.id] });

      successSonner("Activity updated successfully");
    },
  });
}

function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return activityApi.deleteActivity(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      successSonner("Activity deleted successfully");
    },
  });
}

export default function useActivity() {
  const getActivityById = useGetActivityById;
  const getActivities = useGetActivities;
  const getActivityByUserId = useGetActivityByUserId;
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  return {
    getActivityById,
    getActivities,
    getActivityByUserId,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
