import collectionApi from "@/api/collection-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type {
  CreateCollection,
  UpdateCollection,
} from "@/schemas/collection-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => collectionApi.getCollections(),
  });
}

function useGetCollectionById(id: string) {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => collectionApi.getCollectionById(id),
    enabled: !!id,
  });
}

function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCollection) => {
      return await collectionApi.createCollection(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });

      successSonner("Collection created successfully");
    },
  });
}

function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCollection;
    }) => {
      return await collectionApi.updateCollection(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      successSonner("Collection updated successfully");
    },
  });
}

function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await collectionApi.deleteCollection(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      successSonner("Collection deleted successfully");
    },
  });
}

export default function useCollection() {
  const getCollections = useGetCollections();
  const getCollectionById = useGetCollectionById;
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  return {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
  };
}
