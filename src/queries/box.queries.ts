import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { getBoxes, createBox, updateBox, deleteBox } from '@/api/boxes.api';
import type { CreateBoxRequest, UpdateBoxRequest } from '@/types/box.types';

export const boxKeys = {
  all: () => ['boxes'] as const,
};

export const useBoxesQuery = () =>
  useQuery({
    queryKey: boxKeys.all(),
    queryFn: () => getBoxes(),
  });

export const useCreateBoxMutation = () =>
  useMutation({
    mutationFn: (data: CreateBoxRequest) => createBox(data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: boxKeys.all() }),
  });

export const useUpdateBoxMutation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoxRequest }) => updateBox(id, data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: boxKeys.all() }),
  });

export const useDeleteBoxMutation = () =>
  useMutation({
    mutationFn: (id: string) => deleteBox(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: boxKeys.all() }),
  });
