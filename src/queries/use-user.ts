import userApi from "@/api/user-api";
import { successSonner } from "@/components/ui/sonner";
import { axiosError } from "@/lib/axios";
import type { UpdateUser, User } from "@/schemas/user-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getUsers(),
  });
}

function useGetUserById(id: string) {
  const queryClient = useQueryClient();

  const cachedData = queryClient
    .getQueryData<User[]>(["users"])
    ?.find((i) => i.id === id);

  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    initialData: cachedData,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUser }) => {
      return await userApi.updateUser(id, data);
    },
    onError: (error) => axiosError(error),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });

      successSonner("User updated successfully");
    },
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return userApi.deleteUser(id);
    },
    onError: (error) => axiosError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      successSonner("User deleted successfully");
    },
  });
}

export default function useUser() {
  const getUsers = useGetUsers();
  const deleteUser = useDeleteUser();
  const getUserById = useGetUserById;
  const updateUser = useUpdateUser();

  return {
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
  };
}
