import batchingApi, {
  type BatchDataParams,
  type UpdateBatchParams,
} from "@/api/batching-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { toast } from "sonner";

function useBatchUpdate<T>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBatchParams & { table?: Table<T> }) => {
      const response = await batchingApi.update(data);
      return { ...response, table: data.table };
    },
    onError: (error) => axiosError(error),
    onSuccess: (response, variables) => {
      const { data, table } = response;

      queryClient.invalidateQueries({
        queryKey: [variables.apiRoute],
      });

      if (table) {
        table.resetRowSelection();
      }

      toast.dismiss("selection-sonner");
      successSonner(data.message);
    },
  });
}

function useBatchDelete<T>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BatchDataParams & { table?: Table<T> }) => {
      const response = await batchingApi.remove(data);
      return { ...response, table: data.table };
    },
    onError: (error) => axiosError(error),
    onSuccess: (response, variables) => {
      const { data, table } = response;

      queryClient.invalidateQueries({
        queryKey: [variables.apiRoute],
      });

      if (table) {
        table.resetRowSelection();
      }

      toast.dismiss("selection-sonner");
      successSonner(data.message);
    },
  });
}

export default function useBatching<T>() {
  const batchUpdate = useBatchUpdate<T>();
  const batchDelete = useBatchDelete<T>();

  return {
    batchUpdate,
    batchDelete,
  };
}
