import taskApi from "@/api/task-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type { CreateTask, Task, UpdateTask } from "@/schemas/task-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getTasks(),
  });
}

function useGetTaskById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Task[]>(["tasks"])
    ?.find((task) => task.id === id);

  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskApi.getTaskById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useGetTaskByUserId(userId: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<Task[]>(["tasks"])
    ?.filter((task) => task.assignedTo === userId);

  return useQuery({
    queryKey: ["task", userId],
    queryFn: () => taskApi.getTaskByUserId(userId),
    enabled: !!userId,
    initialData: cachedData,
  });
}

function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTask) => {
      return await taskApi.createTask(data);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      successSonner("Task created successfully");
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTask }) => {
      return await taskApi.updateTask(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["task", variables.id],
      });

      successSonner("Task updated successfully");
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await taskApi.deleteTask(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({ queryKey: ["task", variables] });

      successSonner("Task deleted successfully");
    },
  });
}

export default function useTask() {
  const getTasks = useGetTasks();
  const getTaskById = useGetTaskById;
  const getTaskByUserId = useGetTaskByUserId;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return {
    getTasks,
    getTaskById,
    getTaskByUserId,
    createTask,
    updateTask,
    deleteTask,
  };
}
