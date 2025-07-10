import requestAccessApi from "@/api/request-access-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type {
  CreateRequestAccess,
  RequestAccess,
  UpdateRequestAccess,
} from "@/schemas/request-access-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetRequestAccess() {
  return useQuery({
    queryKey: ["requests-access"],
    queryFn: () => requestAccessApi.getRequestsAccess(),
  });
}

function useGetRequestAccessById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<RequestAccess[]>(["requests-access"])
    ?.find((i) => i.id === id);

  return useQuery({
    queryKey: ["request-access", id],
    queryFn: () => requestAccessApi.getRequestAccessById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useCreateRequestAccess() {
  return useMutation({
    mutationFn: async (data: CreateRequestAccess) => {
      return await requestAccessApi.createRequestAccess(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      successSonner("Request access created successfully");
    },
  });
}

function useUpdateRequestAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRequestAccess;
    }) => {
      return await requestAccessApi.updateRequestAccess(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests-access"],
      });

      queryClient.invalidateQueries({
        queryKey: ["request-access", variables.id],
      });

      successSonner("Request access updated successfully");
    },
  });
}

function useDeleteRequestAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await requestAccessApi.deleteRequestAccess(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests-access"],
      });
      successSonner("Request access deleted successfully");
    },
  });
}

export default function useRequestAccess() {
  const getRequestAccess = useGetRequestAccess();
  const getRequestAccessById = useGetRequestAccessById;
  const createRequestAccess = useCreateRequestAccess();
  const updateRequestAccess = useUpdateRequestAccess();
  const deleteRequestAccess = useDeleteRequestAccess();

  return {
    getRequestAccess,
    getRequestAccessById,
    createRequestAccess,
    updateRequestAccess,
    deleteRequestAccess,
  };
}
