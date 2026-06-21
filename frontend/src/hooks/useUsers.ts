import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User, PaginatedResponse, UserStats } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

export function useUsers(page = 1, limit = 10, search = '') {
  return useQuery({
    queryKey: userKeys.list({ page, limit, search }),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User[]>>('/users', {
        params: { page, limit, search },
      });
      return data;
    },
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: userKeys.detail(id as number),
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const { data } = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: UserStats }>('/users/stats');
      return data.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post<{ success: boolean; data: User }>('/users', userData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const { data: responseData } = await api.put<{ success: boolean; data: User }>(`/users/${id}`, data);
      return responseData.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
