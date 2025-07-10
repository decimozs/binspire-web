import issueApi from "@/api/issue-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type { CreateIssue, Issue, UpdateIssue } from "@/schemas/issue-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: () => issueApi.getIssues(),
  });
}

function useGetIssueById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Issue[]>(["issues"])
    ?.find((i) => i.id === id);

  return useQuery({
    queryKey: ["issue", id],
    queryFn: () => issueApi.getIssueById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIssue) => {
      return await issueApi.createIssue(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });

      successSonner("Issue created successfully");
    },
  });
}

function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateIssue }) => {
      return await issueApi.updateIssue(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });

      queryClient.invalidateQueries({ queryKey: ["issue", variables.id] });

      successSonner("Issue updated successfully");
    },
  });
}

function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await issueApi.deleteIssue(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
      successSonner("Issue deleted successfully");
    },
  });
}

export default function useIssue() {
  const getIssues = useGetIssues();
  const getIssueById = useGetIssueById;
  const createIssue = useCreateIssue();
  const updateIssue = useUpdateIssue();
  const deleteIssue = useDeleteIssue();

  return {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
  };
}
