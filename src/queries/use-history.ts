import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type { CreateHistory, UpdateHistory } from "@/schemas/history-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { History } from "@/schemas/history-schema";
import historyApi from "@/api/history-api";

function useGetHistories() {
  return useQuery({
    queryKey: ["histories"],
    queryFn: () => historyApi.getHistories(),
  });
}

function useGetHistoryById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<History[]>(["histories"])
    ?.find((i) => i.id === id);

  return useQuery({
    queryKey: ["history", id],
    queryFn: () => historyApi.getHistoryById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useGetHistoryByUserId(userId: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<History[]>(["histories"])
    ?.filter((i) => i.actorId === userId);

  return useQuery({
    queryKey: ["user-history"],
    queryFn: () => historyApi.getHistoryByUserId(userId),
    enabled: !!userId,
    initialData: cachedData,
  });
}

function useCreateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHistory) => {
      return await historyApi.createHistory(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
      successSonner("History created successfully");
    },
  });
}

function useUpdateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateHistory & { id: string }) => {
      return await historyApi.updateHistory(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
      successSonner("History updated successfully");
    },
  });
}

function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await historyApi.deleteHistory(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
      successSonner("History deleted successfully");
    },
  });
}

export default function useHistory() {
  const getHistories = useGetHistories();
  const getHistoryById = useGetHistoryById;
  const getHistoryByUserId = useGetHistoryByUserId;
  const createHistory = useCreateHistory();
  const updateHistory = useUpdateHistory();
  const deleteHistory = useDeleteHistory();

  return {
    getHistories,
    getHistoryById,
    getHistoryByUserId,
    createHistory,
    updateHistory,
    deleteHistory,
  };
}
