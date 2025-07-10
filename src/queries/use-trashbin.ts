import trashbinApi from "@/api/trashbin-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type {
  CreateTrashbin,
  Trashbin,
  UpdateTrashbin,
} from "@/schemas/trashbin-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetTrashbins() {
  return useQuery({
    queryKey: ["trashbins"],
    queryFn: () => trashbinApi.getTrashbins(),
  });
}

function useGetTrashbinById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Trashbin[]>(["trashbins"])
    ?.find((tb) => tb.id === id);

  return useQuery({
    queryKey: ["trashbin", id],
    queryFn: () => trashbinApi.getTrashbinById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useCreateTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTrashbin) => {
      return await trashbinApi.createTrashbin(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trashbins"],
      });

      successSonner("Trashbin created successfully");
    },
  });
}

function useUpdateTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTrashbin }) => {
      return await trashbinApi.updateTrashbin(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trashbins"],
      });

      queryClient.invalidateQueries({ queryKey: ["trashbin", variables.id] });

      successSonner("Trashbin updated successfully");
    },
  });
}

function useDeleteTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await trashbinApi.deleteTrashbin(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trashbins"],
      });
      successSonner("Trashbin deleted successfully");
    },
  });
}

export default function useTrashbin() {
  const getTrashbins = useGetTrashbins();
  const getTrashbinById = useGetTrashbinById;
  const createTrashbin = useCreateTrashbin();
  const updateTrashbin = useUpdateTrashbin();
  const deleteTrashbin = useDeleteTrashbin();

  return {
    getTrashbins,
    getTrashbinById,
    createTrashbin,
    updateTrashbin,
    deleteTrashbin,
  };
}
